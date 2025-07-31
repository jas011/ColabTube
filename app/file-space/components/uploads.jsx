// ⚠️ IMPORTANT: Make sure these imports/functions don't make API calls:
// - toLocalStorage() function should be local-only
// - Gif() function should not upload to server
// - FILE and Folder classes should not make network requests

import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { useFolder } from "../context/context";
import { File as FILE, Folder } from "../utilities/structures/Folder";
import { toast } from "sonner"
import { toLocalStorage } from "../utilities/DBFolder/dbFetchFolder";
// import { Gif } from "../utilities/ffmpeg";
import { Files } from "../utilities/localDB/db";
import { Gif } from "../utilities/ffmpeg";
// Local storage for blobs (in-memory store)
const localBlobStore = new Map();

// Function to store file locally with simulated progress
function storeFileLocally(file, fileId, progressCallback) {
  return new Promise((resolve, reject) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const blob = new Blob([file], { type: file.type });

        // 💾 Store in IndexedDB using Dexie
        Files.put({
          fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          blob,
          createdAt: new Date()
        })
          .then(() => {
            const blobUrl = URL.createObjectURL(blob);
            progressCallback(100);
            resolve({ blobUrl, blob });
          })
          .catch((err) => {
            console.error("Dexie store error", err);
            reject(err);
          });
      } else {
        progressCallback(Math.floor(progress));
      }
    }, 50 + Math.random() * 100);
  });
}

// Function to store thumbnail locally and return blob URL
export function storeThumbnailLocally(file, fileId, progressCallback = () => { }) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([file], { type: file.type });
    // 💾 Store in IndexedDB using Dexie
    Files.put({
      fileId: `thumbnail/${fileId}`,
      name: file.name,
      type: file.type,
      size: file.size,
      blob,
      createdAt: new Date()
    })
      .then(() => {
        const blobUrl = URL.createObjectURL(blob);
        progressCallback(100);
        resolve({ blobUrl, blob });
      })
      .catch((err) => {
        console.error("Dexie store error", err);
        reject(err);
      });


  });
}

// Mock function to replace UploadEvent (now just logs locally)
// Receives object structure: { "fileId": { FolderID, address, awsKey, ... }, ... }

export const FileUpload = forwardRef((_, ref) => {
  const folderContext = useFolder();

  if (!folderContext) {
    console.error("Folder context is undefined");
    return null;
  }

  const { current, folderMap, Route, fileMap } = folderContext;

  const handelInput = async (event) => {
    const files = event.target.files;
    const folder = folderMap.get(current);

    const fileArray = {};

    for (const file of files) {
      const f = {
        name: file.name,
        teamID: "54566",
        uploaderID: "local_user",
        blobUrl: "", // Will be set after local storage
        thumbnailBlobUrl: "", // For thumbnails
        previewBlobUrl: "", // For previews
        mimeType: file.type,
        size: file.size,
        address: "string",
      };

      const filem = folder.addFile(new FILE(f, current));
      toLocalStorage({ folders: folder, flag: true });

      // Structure data exactly like the expected format
      fileArray[filem.id] = {
        FolderID: filem.address.split("/").slice(-2, -1).toString(),
        address: filem.address,
        awsKey: `Cloud/${filem.id}.${file.name.split('.').pop()}`, // Local equivalent
        blobUrl: "", // Will be updated after storage
        createdAt: new Date(),
        id: filem.id,
        mimeType: file.type,
        name: file.name,
        previewKey: file.name,
        size: file.size,
        teamID: "54566",
        thumbnailKey: file.name,
        type: "file",
        updatedAt: new Date(),
        uploaderID: "local_user",
        _id: filem.id
      };


      const progressToast = createProgressToast(filem.name);

      console.log("Processing file:", file);
      console.log("File type check - video:", file.type.includes("video"), "image:", file.type.includes("image"));

      // Handle different file types
      if (file.type.includes("video")) {
        console.log("Processing video file");
        // You can still use Gif function if it works with local files
        Gif(file, filem.id, filem)
      } else if (file.type.includes("image")) {
        console.log("Processing image file");
        // Create thumbnail and get its blob URL
        const thumbnailBlobUrl = await imageThumbUpload(file, filem.id);
        if (thumbnailBlobUrl) {
          fileArray[filem.id].thumbnailKey = thumbnailBlobUrl;
          filem.thumbnailBlobUrl = thumbnailBlobUrl;
        }
      }

      // Store file locally instead of uploading to S3
      try {
        const result = await storeFileLocally(file, filem.id, (percentage) => {
          progressToast.updateProgress(percentage);
          if (percentage >= 100) {
            progressToast.complete();
          }
        });

        // Update file object with blob URLs and ensure proper structure for toLocalStorage
        filem.blobUrl = result.blobUrl;
        filem.awsKey = result.blobUrl; // Set awsKey to blob URL for toLocalStorage
        if (fileArray[filem.id].thumbnailKey) {
          filem.thumbnailKey = fileArray[filem.id].thumbnailKey; // Set thumbnail if exists
        }
        fileArray[filem.id].awsKey = result.blobUrl; // awsKey now contains the main file blob URL

        // Store to local storage using your toLocalStorage function
        Route(current, true);

      } catch (error) {
        console.error("Error storing file locally:", error);
        progressToast.dismiss();
        toast.error(`Failed to store ${filem.name}`);
      }

      fileMap.set(filem.id, filem);
    }
    const Files = Object.values(fileArray).map(f => f);
    for (const file of Files) {
      localStorage.setItem(file.id, JSON.stringify(file))
    }


  };

  return (
    <Input
      onInput={handelInput}
      id="picture"
      className="hidden"
      type="file"
      multiple
      ref={ref}
    />
  );
});

export const FolderUpload = forwardRef((_, ref) => {
  const folderContext = useFolder();

  if (!folderContext) {
    console.error("Folder context is undefined");
    return null;
  }

  const { current, folderMap, Route, fileMap, TrannslateFolder } = folderContext;

  const handelInput = async (e) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    const firstPath = fileList[0].webkitRelativePath;

    console.log("Processing folder structure:", firstPath);

    // Group files by folders
    const folderStructure = {};
    fileList.forEach(file => {
      const path = file.webkitRelativePath;
      const folderPath = path.substring(0, path.lastIndexOf("/"));

      if (!folderStructure[folderPath]) {
        folderStructure[folderPath] = [];
      }
      folderStructure[folderPath].push(file);
    });

    const address = new Map();

    for (const [path, files] of Object.entries(folderStructure)) {
      let newFolder;

      if (path.split("/").length == 1) {
        const Parentfolder = folderMap.get(current);
        newFolder = Parentfolder.addFolder(new Folder(path));
        console.log("Created top-level folder:", newFolder);
        address.set(path, newFolder);
        folderMap.set(newFolder.address, newFolder);
        TrannslateFolder.set(newFolder.key, newFolder.name);
      } else {
        const folderaddress = path.split("/");
        const Parentfolder = address.get(folderaddress.slice(0, -1).join("/"));
        console.log("Parent folder:", Parentfolder);
        newFolder = Parentfolder.addFolder(new Folder(folderaddress.pop()));
        address.set(path, newFolder);
        folderMap.set(newFolder.address, newFolder);
        TrannslateFolder.set(newFolder.key, newFolder.name);
      }

      // Store folder metadata using toLocalStorage
      try {
        // Structure folder data for toLocalStorage
        const folderForStorage = {
          contents: {
            folders: newFolder.subfolders || [],
            files: newFolder.files || []
          },
          key: newFolder.key,
          name: newFolder.name,
          address: newFolder.address,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        toLocalStorage({
          folders: folderForStorage,
          teamID: "54566",
          flag: true
        });
      } catch (error) {
        console.error("Error storing folder with toLocalStorage:", error);
      }

      const fileArray = {};

      for (const file of files) {
        const f = {
          name: file.name,
          teamID: "54566", // Fixed teamID as requested
          uploaderID: "local_user",
          blobUrl: "",
          thumbnailBlobUrl: "",
          previewBlobUrl: "",
          mimeType: file.type,
          size: file.size,
          address: "string",
          _id: file.name + "_" + Date.now(),
          id: file.name + "_" + Date.now(), // Add id field for toLocalStorage
          awsKey: "", // Will be set to blob URL
          thumbnailKey: "", // Will be set to thumbnail blob URL
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const filem = newFolder.addFile(new FILE(f, current));

        // Structure data exactly like the expected format
        fileArray[filem.id] = {
          FolderID: filem.address.split("/").slice(-2, -1).toString(),
          address: filem.address,
          awsKey: "", // Will be set to blob URL after storage
          thumbnailKey: "", // Will be set to thumbnail blob URL after storage
          createdAt: new Date(),
          id: filem.id,
          mimeType: file.type,
          name: file.name,
          previewKey: file.name,
          size: file.size,
          teamID: "54566", // Fixed teamID as requested
          type: "file",
          updatedAt: new Date(),
          uploaderID: "local_user",
          _id: filem.id
        };

        // Store file locally
        try {
          // Handle image thumbnails first
          if (file.type.includes("image")) {
            const thumbnailBlobUrl = await imageThumbUpload(file, filem.id);
            if (thumbnailBlobUrl) {
              fileArray[filem.id].thumbnailKey = thumbnailBlobUrl;
              filem.thumbnailBlobUrl = thumbnailBlobUrl;
              filem.thumbnailKey = thumbnailBlobUrl; // Add to filem for toLocalStorage
            }
          }

          const result = await storeFileLocally(file, filem.id, () => { });
          filem.blobUrl = result.blobUrl;
          filem.awsKey = result.blobUrl; // Set awsKey to blob URL for toLocalStorage
          fileArray[filem.id].awsKey = result.blobUrl; // awsKey now contains the main file blob URL

          // Store individual file metadata using toLocalStorage

        } catch (error) {
          console.error("Error storing file locally:", error);
        }

        fileMap.set(filem.id, filem);
      }
      const Files = Object.values(fileArray).map(f => f);
      for (const file of Files) {
        localStorage.setItem(file.id, JSON.stringify(file))
      }

      Route(current, true);

      console.log("Processed folder structure:", folderStructure);
    }
  };

  return (
    <Input
      onInput={handelInput}
      id="picture"
      className="hidden"
      type="file"
      webkitdirectory="true"
      multiple
      ref={ref}
    />
  );
});

function imageThumbUpload(file, id) {
  console.log("Creating image thumbnail");

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.onload = function () {
        console.log("Image loaded for thumbnail creation");

        // Resize and draw image
        canvas.width = img.width * 0.7;
        canvas.height = img.height * 0.7;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          const thumbFile = new File([blob], id + ".jpg", {
            type: "image/jpeg",
          });

          console.log("Thumbnail file created:", thumbFile);

          // Store thumbnail locally and get blob URL
          try {
            const result = await storeThumbnailLocally(thumbFile, id);
            console.log("Thumbnail stored locally with blob URL:", result.blobUrl);
            resolve(result.blobUrl); // Return the thumbnail blob URL
          } catch (error) {
            console.error("Error storing thumbnail:", error);
            resolve(null);
          }
        }, "image/jpeg");
      };

      img.onerror = function () {
        console.error("Error loading image for thumbnail");
        resolve(null);
      };

      img.src = e.target.result;
    };

    reader.onerror = function () {
      console.error("Error reading file for thumbnail");
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
}

function createProgressToast(fileName = "File") {
  let progressElement = null;

  const dismiss = () => {
    if (toastId) toast.dismiss(toastId);
  };

  const toastId = toast.message(() => (
    <div>
      <h1>Storing {fileName} locally</h1>
      <div
        onClick={dismiss}
        ref={(el) => { progressElement = el; }}
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
      >
        0%
      </div>
    </div>
  ), {
    duration: 500000,
  });

  return {
    id: toastId,
    updateProgress: (percentage) => {
      if (progressElement) {
        progressElement.innerHTML = `${percentage}%`;
      }
    },
    complete: (successMessage = `${fileName} stored locally`) => {
      if (progressElement) {
        progressElement.click();
      }
      toast.success(successMessage);
    },
    dismiss
  };
}

// Utility functions to manage local blob store
export const LocalBlobManager = {
  // Get stored file by ID
  getFile: (fileId) => {
    return localBlobStore.get(fileId);
  },

  // Get all stored files
  getAllFiles: () => {
    return Array.from(localBlobStore.entries());
  },

  // Delete stored file
  deleteFile: (fileId) => {
    const stored = localBlobStore.get(fileId);
    if (stored && stored.blobUrl) {
      URL.revokeObjectURL(stored.blobUrl); // Clean up blob URL
    }
    return localBlobStore.delete(fileId);
  },

  // Clear all stored files
  clearAll: () => {
    // Clean up all blob URLs
    localBlobStore.forEach((stored) => {
      if (stored.blobUrl) {
        URL.revokeObjectURL(stored.blobUrl);
      }
    });
    localBlobStore.clear();
  },

  // Get storage statistics
  getStorageStats: () => {
    let totalSize = 0;
    let fileCount = 0;

    localBlobStore.forEach((stored) => {
      if (stored.originalFile) {
        totalSize += stored.originalFile.size;
        fileCount++;
      }
    });

    return {
      fileCount,
      totalSize,
      formattedSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
    };
  }
};