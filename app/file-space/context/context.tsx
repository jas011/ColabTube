"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  useRef,
} from "react";
import { DB_rosot } from "../utilities/DBFolder/dbFetchFolder";
import { DetailCard } from "../components/DetailCard";
import Folder from "@/components/reactBits/Folder/Folder";
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
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

// import Move from "../components/Move";
// import Copy from "../components/Copy";
import { AlertDialogDemo } from "../components/DetailCard";
export interface FolderContextType {
  current: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
  FolderContent: ReactElement[];
  setFolderContent: React.Dispatch<React.SetStateAction<ReactElement[]>>;
  folderMap: Map<string, any>;
  fileMap: Map<string, any>;
  RenderFolder: (folder: any) => void;
  TrannslateFolder: Map<string, any>;
  UploadEvent: ((uploads: folder | file) => void) | undefined;
  newEvent: (event: Operation) => void;
  flush: (() => void) | undefined;
  session: any;
  hasData: boolean;
  Route: (folderAddress: string, force?: boolean) => void;
}

import {
  folder,
  file,
  EventLog,
  ComposedEvent,
  Operation,
} from "../utilities/structures/Events";

async function UploadEvent(uploads: folder | file) {
  // Example: call from a component {
  try {
    const res = await fetch("/api/uploadMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: uploads }),
    });

    const data = await res.json();
    console.log("Kafka response:", data);
  } catch (error) {
    console.error("Kafka send failed:", error);
  }
}

export const FolderContext = createContext<FolderContextType | undefined>(
  undefined
);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const [current, setCurrent] = useState<string>("");
  const [FolderContent, setFolderContent] = useState<ReactElement[]>([]);
  const OperationLogs = useRef<EventLog>(new EventLog());

  const [hasData, YesWeHaveData] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  // Use useRef to persist these maps across renders without reinitializing
  const folderMapRef = useRef(new Map<string, any>());
  const fileMapRef = useRef(new Map<string, any>());
  const TrannslateFolder = useRef(new Map<string, any>());

  async function hello() {
    const root: any = DB_rosot();
    const iterator = (folder: any) => {
      // Mapping all folders and files
      Object.entries(folder.contents)
        .reverse()
        .forEach(([key, value]: [string, any]) => {
          if (key === "files") {
            Object.values(value).forEach((file: any) => {
              fileMapRef.current.set(file.id, file);
            });
          }
          if (key === "folders") {
            value.forEach((subFolder: any) => {
              folderMapRef.current.set(subFolder.address, subFolder);
              TrannslateFolder.current.set(subFolder.key, subFolder.name);
              iterator(subFolder);
            });
          }
        });
    };

    // Only initialize the folderMapRef if it's empty
    if (folderMapRef.current.size === 0) {
      iterator(root);
      console.log(root, folderMapRef.current);

      TrannslateFolder.current.set("root", "root");
      folderMapRef.current.set(root.address, root);
    }
  }

  const RenderFolder = ({ folderAddress }: { folderAddress: string }) => {
    const folder: any = folderMapRef.current.get(folderAddress);
    // console.log(folderMapRef.current);

    const folders: any[] = []; // New elements array to store the elements
    const files: any[] = []; // New elements array to store the elements

    if (folder != null) {
      Object.entries(folder.contents) // Iterating over the contents of the folder
        .reverse()
        .forEach(([key, value]: [string, any]) => {
          if (key === "files") {
            Object.values(value).forEach((file: any) => {
              if (localStorage.getItem("find") == file.id)
                files.push(
                  <DetailCard key={file.id} fileDetails={file} cls={"shake"} />
                );
              else files.push(<DetailCard key={file.id} fileDetails={file} />);
            });
          } else if (key === "folders") {
            value.forEach((subFolder: any) => {
              folders.push(
                <div
                  key={subFolder.name + Math.random()}
                  className="flex flex-col w-fit h-fit cursor-pointer"
                  // onClick={() => {
                  //   setFolderContent([]);
                  //   RenderFolder({
                  //     folderAddress: subFolder.address,
                  //   });
                  // }}
                >
                  <FolderElem
                    setFolderContent={setFolderContent}
                    subFolder={subFolder}
                    newEvent={OperationLogs.current.addEvent}
                  />
                </div>
              );
            });
          }
        });

      setFolderContent([
        folders.length > 0 ? (
          <div
            key={Math.random()}
            id={"root"}
            className="flex flex-col gap-3 p-4 flex-row"
          >
            {folders}
          </div>
        ) : (
          <div key={Math.random()}></div>
        ),
        <div
          key={Math.random() + 1}
          id={"root"}
          className="flex flex-col gap-4 p-4 flex-row"
        >
          {files}
        </div>,
      ]);
      setCurrent(folderAddress);
    } else {
      toast.error("Folder doesn't exist!", { duration: 3000 });
      Route(current);
    }
  };

  function Route(folderAddress: string, force?: boolean) {
    console.log(force);
    RenderFolder({ folderAddress: folderAddress });

    if (folderAddress != "root")
      router.push(`${pathname}?folder=${folderAddress}`, { scroll: false });
    else router.push(`${pathname}`, { scroll: false });
  }

  useEffect(() => {
    if (hasData) return;
    if (session.status === "authenticated" && session?.data) {
      hello().then(() => {
        YesWeHaveData(true);
        RenderFolder({ folderAddress: "root" });
      });
    }

    OperationLogs.current = new EventLog(fileEvents);

    async function fileEvents(events: Record<string, ComposedEvent>) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("/api/fileMessage", {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({ message: events }),
          redirect: "follow",
        });
      } catch (error) {
        console.error("Kafka send failed:", error);
      }
    }
  }, [session]); // Initialize only once on mount

  function FolderElem({ subFolder, setFolderContent }: any) {
    const [isRename, setIsRename] = useState<boolean>(false);
    const img = useRef<any>(null);
    const fileName = useRef<any>(null);
    useEffect(() => {
      if (isRename) {
        setTimeout(() => {
          fileName.current?.focus(); // Ensure input exists before focusing
        }, 10);
      }
    }, [isRename]);
    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              onClick={() => {
                setFolderContent([]);
                RenderFolder({
                  folderAddress: subFolder.address,
                });
                router.push(`${pathname}?folder=${subFolder.address}`, {
                  scroll: false,
                });
              }}
            >
              <Folder
                size={0.8}
                color="#00d8ff"
                ref={img}
                className="custom-folder w-fit "
              />
            </div>
          </ContextMenuTrigger>
          <h1
            style={{ alignSelf: "center" }}
            onBlur={() => {
              setIsRename(false);
            }}
            className="text text-sm w-[80%]"
          >
            {!isRename ? (
              <>{subFolder.name}</>
            ) : (
              <input
                style={{ alignSelf: "center", outline: "none" }}
                ref={fileName}
                onKeyDown={(e) => {
                  if (e.code == "Enter") setIsRename(false);
                }}
                onInput={(e: any) => subFolder.rename(e.target.value)}
                defaultValue={subFolder.name}
                className="p-0 h-fit text text-sm"
                type="text"
              />
            )}
          </h1>

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
                    {subFolder.name}
                  </span>
                </ContextMenuLabel>

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Type</span>
                  <span className="text-xs text-[#797979]">Folder</span>
                </ContextMenuLabel>
                <ContextMenuSeparator className="mx-3 my-1" />

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Location</span>
                  <span className="text-xs text-[#797979]">
                    {subFolder.address}
                  </span>
                </ContextMenuLabel>

                {/* <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Size</span>
                  <span className="text-xs text-[#797979]">159MB</span>
                </ContextMenuLabel> */}
                <ContextMenuSeparator className="mx-3 my-1" />
                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Uploaded by</span>
                  <span className="text-xs text-[#797979]">
                    {session.data?.user.name}
                  </span>
                </ContextMenuLabel>

                <ContextMenuLabel
                  className="items-center py-0.5 px-3 data-[inset]:pl-3 flex justify-between"
                  inset
                >
                  <span>Date Created</span>
                  <span className="text-xs text-[#797979]">
                    {subFolder.createdAt.toString()}
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
            {/* <ContextMenuSeparator className="mx-3 my-1" />
            <Move file={subFolder} />
            <Copy file={subFolder} /> */}
            <ContextMenuSeparator className="mx-3 my-1" />
            {/* <ContextMenuItem className="py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]">
    Delete
  </ContextMenuItem> */}
            <AlertDialogDemo file={subFolder} />
            <ContextMenuItem
              onClick={() => setIsRename(true)}
              className=" py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px]"
            >
              Rename
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </>
    );
  }

  return (
    <FolderContext.Provider
      value={{
        current,
        setCurrent,
        FolderContent,
        setFolderContent,
        folderMap: folderMapRef.current,
        fileMap: fileMapRef.current,
        RenderFolder,
        TrannslateFolder: TrannslateFolder.current,
        UploadEvent,
        flush: OperationLogs.current?.flush,
        newEvent: OperationLogs.current.addEvent,
        session: session,
        hasData,
        Route,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export function useFolder() {
  const folderContext = useContext(FolderContext);
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  return folderContext;
}
