import { Folder, File } from "../structures/Folder";

export function DB_rosot() {
  function Datafetch(message: any) {
    try {
      const folderResponse = [];
      if (message.folders) {
        for (const folder of message.folders) {
          console.log("123456", folder);
          const content: any = localStorage.getItem(folder);
          folderResponse.push(JSON.parse(content));
        }
      } else if (message.files) {
        for (const file of message.files) {
          console.log("123456", file);
          const content: any = localStorage.getItem(file);
          folderResponse.push(JSON.parse(content));
        }
      }
      console.log(folderResponse);
      return folderResponse;
    } catch (error) {
      console.error("datafetch error:", error);
      return null;
    }
  }

  function iterator(subfolder: Folder, content: any) {
    console.log(subfolder, content);
    if (content?.files?.length > 0) {
      const files = Datafetch({ files: content.files });

      if (files && files.length > 0) {
        console.log("MAy Filessssssss", files);
        const f = files.filter((f) => f != null);
        for (const file of f) {
          subfolder.addFile(new File(file, ""));
        }
      }
    }

    if (content?.folders?.length > 0) {
      const folders = Datafetch({ folders: content.folders });
      console.log(folders);
      if (folders && folders.length > 0) {
        const f = folders.filter((f) => f != null);
        for (const folder of f) {
          const newFolder = subfolder.addFolder(
            new Folder(
              folder.name,
              folder.key,
              folder.createdAt,
              folder.updatedAt
            )
          );
          if (newFolder) iterator(newFolder, folder.content);
        }
      }
    }
  }
  const Root = localStorage.getItem("root");
  if (Root) {
    const Obj = JSON.parse(Root);
    console.log(Obj.content);
    const root = new Folder(Obj.name, Obj.key);
    iterator(root, Obj.content);
    return root;
  }
  const root = new Folder("root", "root");
  iterator(root, root.contents);
  toLocalStorage({ folders: root, flag: true });
  return root;
}

export function toLocalStorage({
  folders,
  files,
  teamID,
  flag = false,
  isDataResponse = false,
}: {
  teamID?: string;
  folders?: any;
  files?: any;
  flag?: boolean;
  isDataResponse?: boolean;
}) {
  // localStorage.setItem("flag", "1");
  console.log(folders);
  if (flag) {
    if (folders) {
      const Contents = folders["contents"];
      const folderArr =
        Contents.folders.length > 0
          ? Contents.folders.map((f: any) => f.key)
          : [];
      let fileArr;
      if (isDataResponse)
        fileArr =
          Contents.files.length > 0 ? Contents.files.map((f: any) => f.id) : [];
      else
        fileArr =
          Object.values(Contents.files).length > 0
            ? Object.values(Contents.files).map((f: any) => f.id)
            : [];

      const data = {
        content: {
          folders: folderArr,
          files: fileArr,
        },
        key: folders.key,
        teamID,
        name: folders.name,
        location: folders.address,
        // parentID:"root",
        // parentLocation:"root",
        createdAt: folders.createdAt,
        updatedAt: folderArr.updatedAt,
      };
      folders = [data];
    } else if (files) {
      const data = {
        _id: files.id,
        teamID,
        name: files.name,
        awsKey: files.awsKey,
        thumbnailKey: files.thumbnailKey,
        mimeType: "string",
        size: files.size,
        createdAt: "2025-05-26T20:56:59.994Z",
        updatedAt: "2025-05-26T20:56:59.994Z",
      };
      files = [data];
    }
  }
  console.log(folders);
  if (folders) {
    for (const folder of folders) {
      localStorage.setItem(folder.key ?? folder.id, JSON.stringify(folder));
    }
  } else if (files) {
    for (const file of files) {
      localStorage.setItem(file._id, JSON.stringify(file));
    }
  }
}

export function removeFromLocalStorage(rootFolder: Folder) {
  async function iterator(folder: Folder) {
    console.log(folder);
    const content: any = folder.contents ?? [];

    // Remove files by ID
    if (content?.files.length > 0) {
      for (const file of content.files) {
        if (file.id) {
          // deleter(file);
          localStorage.removeItem(file.id);
        }
      }
    }

    // Remove current folder by key
    if (folder.key) {
      localStorage.removeItem(folder.key);
    }

    // Recursively remove subfolders
    if (content?.folders.length > 0) {
      for (const subfolder of content.folders) {
        // deleter(subfolder);
        await iterator(subfolder);
      }
    }
  }
  // function deleter(file: any) {}
  console.clear();
  console.log(rootFolder);
  return iterator(rootFolder);
}
