// "use client";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile, toBlobURL } from "@ffmpeg/util";
// import { uploadWithProgress } from "./S3";

// export async function Gif(video: File, id: string) {
//   const ffmpeg = new FFmpeg();
//   const time = [new Date()];

//   const load = async () => {
//     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
//     ffmpeg.on("log", ({ message }) => console.log(message));
//     await ffmpeg.load({
//       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
//       wasmURL: await toBlobURL(
//         `${baseURL}/ffmpeg-core.wasm`,
//         "application/wasm"
//       ),
//     });
//   };

//   const convertToGif = async () => {
//     time.push(new Date());
//     // Convert file to Uint8Array if needed
//     const videoData = await fetchFile(video);

//     await ffmpeg.writeFile("input.mp4", videoData);

//     await ffmpeg.exec([
//       "-i",
//       "input.mp4",
//       "-ss",
//       "0", // start at 30s
//       "-t",
//       "7", // duration 7s
//       "-vf",
//       "setpts=0.25*PTS,fps=10,scale=480:-1:flags=lanczos",
//       "1.gif",
//     ]);
//     const data: any = await ffmpeg.readFile("1.gif");
//     const gifBlob = new Blob([data.buffer], { type: "image/gif" });
//     const file = new File([gifBlob], id + ".gif", {
//       type: "image/gif",
//     });
//     uploadWithProgress(file, `thumbnail/${id}`);
//     time.push(new Date());
//   };
//   await load();
//   await convertToGif();
//   ffmpeg.terminate();
// }

"use client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import { storeThumbnailLocally } from "../components/uploads";

const createThumbnail = async (videoFile: File, filer: any) => {
  const canvas = document.createElement("canvas");
  const videoElem = document.createElement("video");
  const ctx = canvas.getContext("2d");

  videoElem.preload = "metadata";
  videoElem.src = URL.createObjectURL(videoFile);
  videoElem.crossOrigin = "anonymous"; // optional, if needed
  videoElem.muted = true;

  return new Promise<Blob>((resolve, reject) => {
    videoElem.onloadedmetadata = () => {
      // Resize canvas to scaled video dimensions
      canvas.width = videoElem.videoWidth * 0.7;
      canvas.height = videoElem.videoHeight * 0.7;

      videoElem.currentTime = 5; // Go to 5s frame
    };

    videoElem.onseeked = () => {
      ctx?.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return reject("Failed to create blob");
        const blobUrl = URL.createObjectURL(blob);
        filer.thumbnailBlobUrl = blobUrl;
        const thumbFile = blob;
        resolve(thumbFile);
      }, "image/jpeg");
    };

    videoElem.onerror = (e) => reject("Error loading video: " + e);
  });
};

export async function Gif(video: File, id: string, filer: any) {
  const ffmpeg = new FFmpeg();
  const time = [new Date()];

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    ffmpeg.on("log", ({ message }) => console.log(message));
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const convertToGif = async () => {
    time.push(new Date());
    // Convert file to Uint8Array if needed
    const videoData = await fetchFile(video);

    await ffmpeg.writeFile("input.mp4", videoData);

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-ss",
      "0", // start at 30s
      "-t",
      "7", // duration 7s
      "-vf",
      "setpts=0.25*PTS,fps=10,scale=480:-1:flags=lanczos",
      "1.gif",
    ]);
    const data: any = await ffmpeg.readFile("1.gif");
    const gifBlob = new Blob([data.buffer], { type: "image/gif" });
    const file = new File([gifBlob], id + ".gif", {
      type: "image/gif",
    });

    storeThumbnailLocally(file, `gif/${id}`);
    time.push(new Date());
  };

  await load();

  const gifPromise = convertToGif(); // starts FFmpeg GIF
  const thumbPromise = createThumbnail(video, filer); // starts canvas

  const [thumbFile] = await Promise.all([thumbPromise, gifPromise]);
  storeThumbnailLocally(thumbFile, `${id}`);

  ffmpeg.terminate();
}
