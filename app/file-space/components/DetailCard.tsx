"use client";
import { useState, useRef, useEffect } from "react";
// import NetflixVideoPlayer from "../components/VideoPlayer";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useFolder } from "../context/context";
export function AlertDialogDemo({ file }: { file: any }) {
  const folderContext = useFolder();

  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { Route, folderMap, fileMap } = folderContext;
  const handleDelete = () => {
    if (file.type == "file") {
      const from = folderMap.get(
        file.address.split("/").slice(0, -1).join("/")
      );
      const files = fileMap.get(file.id);
      from.removeFile(files);
      localStorage.removeItem(file.id);
      toLocalStorage({ folders: from, flag: true });
      setTimeout(() => Route(from.address, true), 800);
    } else if (file.type == "folder") {
      const parentAddress = file.address.split("/").slice(0, -1).join("/");
      const parentFolder = folderMap.get(parentAddress);
      const FolderToBeDeleted = folderMap.get(file.address);
      void (async () => {
        await Files.db.delete(file.id);
      });
      removeFromLocalStorage(FolderToBeDeleted);
      parentFolder.removeFolder(file.key);

      toLocalStorage({ folders: parentFolder, flag: true });
      setTimeout(() => Route(parentAddress, true), 200);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="relative flex cursor-default select-none text-black h-fit bg-white items-center text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px] hover:bg-[#017aff] justify-start w-full  hover:text-white">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { Safari } from "@/components/magicui/safari";
import { EllipsisVertical } from "lucide-react";
import { Files } from "@/app/file-space/utilities/localDB/db";
import Move from "./Move";
import Copy from "./Copy";
import {
  removeFromLocalStorage,
  toLocalStorage,
} from "../utilities/DBFolder/dbFetchFolder";

export function DetailCard({
  fileDetails,
  cls,
}: {
  fileDetails: any;
  cls?: any;
}) {
  const name = useRef<string>("");
  const card = useRef<HTMLDivElement>(null);
  const session = {
    status: "authenticated",
    data: {
      team: {
        teamID: "54566",
      },
      user: {
        email: "jaskirat0623@gmail.com",
        name: "jaskirat0623",
      },
    },
  };
  useEffect(() => {
    name.current = fileDetails.name;
  });
  const folderContext = useFolder();

  const fileName = useRef<any>(null);
  const [isRename, setIsRename] = useState<boolean>(false);
  // const { fileMap }: any = getFolder();
  const img = useRef<any>(null);
  const moveButtonRef = useRef<HTMLButtonElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [urls, setUrl] = useState<string>(fileDetails.blobUrl);
  const [thumbnailUrls, setThumbnailUrl] = useState<string>(
    fileDetails.thumbnailBlobUrl
  );
  const [gifUrl, setGifUrl] = useState<string>(fileDetails.thumbnailBlobUrl);

  useEffect(() => {
    if (isRename) {
      setTimeout(() => {
        fileName.current?.focus(); // Ensure input exists before focusing
      }, 10);
    }
  }, [isRename]);

  useEffect(() => {
    if (cls) {
      console.log(cls);
      card.current?.classList.toggle(cls);
      setTimeout(() => card.current?.classList.toggle(cls), 2000);
      localStorage.removeItem("find");
    }
    const fileUrl = async () => {
      const fileRecord = await Files.get(fileDetails.id);
      const Thumbnail = await Files.get(`thumbnail/${fileDetails.id}`);
      const gif = await Files.get(`thumbnail/gif/${fileDetails.id}`);

      if (!fileRecord) return null;

      const blobUrl = URL.createObjectURL(fileRecord.blob);
      if (Thumbnail) {
        const ThumbnailUrl = URL.createObjectURL(Thumbnail.blob);
        setThumbnailUrl(ThumbnailUrl);
      }
      if (gif) {
        const gifUrl = URL.createObjectURL(gif.blob);
        setGifUrl(gifUrl);
      }
      setUrl(blobUrl);
    };
    fileUrl();
  }, []);

  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }

  function SafariDemo() {
    return (
      <div className="relative">
        {(fileDetails.name.includes("png") ||
          fileDetails.name.includes("jpeg") ||
          fileDetails.name.includes("jpg")) && (
          <Safari url="magicui.design" className="size-full" imageSrc={urls} />
        )}
        {fileDetails.name.includes("mkv") && (
          <Safari url="magicui.design" className="size-full" videoSrc={urls} />
          // <NetflixVideoPlayer videoSrc={urls} />
        )}
        {fileDetails.name.includes("mp4") && (
          <Safari url="magicui.design" className="size-full" videoSrc={urls} />

          // <NetflixVideoPlayer videoSrc={urls} />
        )}
      </div>
    );
  }
  return (
    <>
      <MorphingDialog
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
        }}
      >
        <ContextMenu>
          <div
            style={{
              borderRadius: "12px",
            }}
            ref={card}
            className="flex h-fit flex-col w-[90vw] lg:w-[325px] overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
          >
            <MorphingDialogTrigger>
              <img
                onContextMenu={(e) => e.preventDefault()}
                ref={img}
                src={thumbnailUrls}
                alt="Ghost in the shell - Kôkaku kidôtai"
                className="thumbnail w-[100vw]"
                onMouseEnter={(e: any) =>
                  (e.target.src =
                    fileDetails.name.includes("jpg") ||
                    fileDetails.name.includes("jpeg") ||
                    fileDetails.name.includes("png")
                      ? thumbnailUrls
                      : gifUrl)
                }
                onMouseLeave={(e: any) => (e.target.src = thumbnailUrls)}
              />
            </MorphingDialogTrigger>

            <div
              style={{ justifyContent: "space-between" }}
              className="p-2 flex"
            >
              <h1
                onBlur={() => {
                  setIsRename(false);
                  name.current = fileName.current.value;
                }}
                style={{ wordBreak: "break-word" }}
                className="text text-sm break-word"
              >
                {!isRename ? (
                  <>{fileDetails.name}</>
                ) : (
                  <input
                    ref={fileName}
                    onKeyDown={(e) => {
                      if (e.code == "Enter") setIsRename(false);
                    }}
                    onInput={(e: any) => {
                      fileDetails.rename(
                        e.target.value +
                          "." +
                          fileDetails.name.split(".")[
                            fileDetails.name.split(".").length - 1
                          ]
                      );
                      toLocalStorage({
                        files: fileDetails,
                        flag: true,
                        teamID: session.data?.team.teamID,
                      });
                    }}
                    defaultValue={namerFunction(fileDetails.name)}
                    className="p-0 h-fit text text-sm"
                    style={{ outline: "none" }}
                    type="text"
                  />
                )}
              </h1>

              <ContextMenuTrigger asChild>
                <EllipsisVertical
                  className="h-4"
                  onClick={(event) => {
                    const contextMenuEvent = new MouseEvent("contextmenu", {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                      clientX: event.clientX,
                      clientY: event.clientY,
                    });

                    event.target.dispatchEvent(contextMenuEvent);
                  }}
                />
              </ContextMenuTrigger>
            </div>
          </div>

          <ContextMenuContent
            className="w-48 text"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.5))",
            }}
          >
            <ContextMenuSub>
              <ContextMenuSubTrigger className="py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]">
                About This File
              </ContextMenuSubTrigger>
              <ContextMenuSubContent
                className="w-80 mx-2"
                sideOffset={-200}
                alignOffset={60}
              >
                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Name</span>
                  <span className="text-xs text-[#797979]">
                    {fileDetails.name}
                  </span>
                </ContextMenuLabel>

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Type</span>
                  <span className="text-xs text-[#797979]">
                    {fileDetails.name.split(".")[1]}
                  </span>
                </ContextMenuLabel>
                <ContextMenuSeparator className="mx-3 my-1" />

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Location</span>
                  <span className="text-xs text-[#797979]">
                    {fileDetails.address}
                  </span>
                </ContextMenuLabel>

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Size</span>
                  <span className="text-xs text-[#797979]">
                    {fileDetails.size}MB
                  </span>
                </ContextMenuLabel>
                <ContextMenuSeparator className="mx-3 my-1" />
                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Uploaded by</span>
                  <span className="text-xs text-[#797979]">
                    {session.data.user.name}
                  </span>
                </ContextMenuLabel>

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Date Created</span>
                  <span className="text-xs text-[#797979]">
                    {fileDetails.createdAt.toString()}
                  </span>
                </ContextMenuLabel>
                <ContextMenuSeparator className="mx-3 my-1" />
                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Access Level</span>
                  <span className="text-xs text-[#797979]">
                    Master, Manager
                  </span>
                </ContextMenuLabel>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator className="mx-3 my-1" />
            <ContextMenuItem
              onClick={() => img.current.click()}
              className="py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]"
            >
              Open
            </ContextMenuItem>
            <ContextMenuItem
              onClick={async () => {
                console.log(fileDetails);
                const fileRecord = await Files.get(fileDetails.id);
                if (fileRecord) {
                  const a = document.createElement("a");
                  a.download = urls;
                  a.href = urls;
                  a.click();
                }
              }}
              className="py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]"
            >
              Download
            </ContextMenuItem>

            <ContextMenuSeparator className="mx-3 my-1" />
            <Move ref={moveButtonRef} file={fileDetails} />
            <Copy ref={copyButtonRef} file={fileDetails} />
            <ContextMenuSeparator className="mx-3 my-1" />
            {/* <ContextMenuItem className="py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]">
              Delete
            </ContextMenuItem> */}
            <AlertDialogDemo file={fileDetails} />
            <ContextMenuItem
              onClick={() => setIsRename(true)}
              className=" py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]"
            >
              Rename
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <MorphingDialogContainer>
          <MorphingDialogContent
            style={{
              borderRadius: "12px",
            }}
            className=" h-auto max-w-[90%]  border border-gray-100 bg-white"
          >
            <SafariDemo />
            <MorphingDialogClose className="text-zinc-500" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </>
  );
}

function namerFunction(name: string) {
  const Name = name.split(".");
  Name.pop();
  return Name.join(".");
}
