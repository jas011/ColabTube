"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  forwardRef,
} from "react";
import { useFolder } from "../context/context";
import { File } from "../utilities/structures/Folder";
import { toLocalStorage } from "../utilities/DBFolder/dbFetchFolder";
function Move({
  setAddress,
  folderMap,
  TrannslateFolder,
}: {
  setAddress: Dispatch<SetStateAction<string>>;
  folderMap: any;
  TrannslateFolder: any;
}) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  const [FolderList, setFolderList] = useState<[ReactNode] | []>([]);
  const [current, setCurrent] = useState<string>("root");

  const renderFolderList = (folder: string = "root") => {
    setAddress(folder);
    //navigation
    const { contents } = folderMap.get(folder);
    // console.log(contents.folders);
    const folders: any = contents.folders.map((item: any, index: number) => {
      if (index == 0) {
        return (
          <Button
            key={index}
            ref={firstButtonRef}
            onClick={() => {
              renderFolderList(item.address);
              setCurrent(item.address);
            }}
            className=" mt-1 outline-0 focus:bg-[#017aff] hover:bg-[#017aff] hover:text-white w-full bg-[#eeeded] justify-start text-[#232526]"
          >
            {item.name}
          </Button>
        );
      } else
        return (
          <Button
            key={index}
            onClick={() => {
              renderFolderList(item.address);
              setCurrent(item.address);
            }}
            className=" mt-1 outline-0 focus:bg-[#017aff] hover:bg-[#017aff] hover:text-white w-full bg-[#eeeded] justify-start text-[#232526]"
          >
            {item.name}
          </Button>
        );
    });
    setFolderList(folders);

    // file get and transfer
  };
  const address = current.split("/");
  const breadcrumb: any = [];
  for (let i = 0; i < address.length; i++) {
    if (i != address.length - 1) {
      breadcrumb.push(
        <BreadcrumbItem key={i}>
          <BreadcrumbLink
            onClick={() => {
              // console.log(address.slice(0, i + 1).join("/"));
              renderFolderList(address.slice(0, i + 1).join("/"));
              setCurrent(address.slice(0, i + 1).join("/"));
            }}
          >
            {TrannslateFolder.get(address[i])}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      breadcrumb.push(<BreadcrumbSeparator key={i + 0.012} />);
    } else {
      breadcrumb.push(
        <BreadcrumbItem key={i}>
          <BreadcrumbPage>{TrannslateFolder.get(address[i])}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
  }

  useEffect(() => {
    renderFolderList();
    // Blur the first button on mount
    setTimeout(() => {
      if (firstButtonRef.current) firstButtonRef.current.blur();
    }, 50);
  }, []);
  return (
    <>
      <ScrollArea className="mt-1 h-[316px] w-full rounded-md z-50 min-w-[8rem] overflow-hidden rounded-md bg-popover text-popover-foreground flex flex-row gap-2">
        {FolderList}
      </ScrollArea>
      <Separator className="my-2" />
      <div className=" flex flex-row items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="gap-0.5">{breadcrumb}</BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}

const Copy = forwardRef<HTMLButtonElement, { file: any }>(({ file }, ref) => {
  const [address, setAddress] = useState<string>("root");
  const close = useRef<HTMLButtonElement | null>(null);
  const folderContext = useFolder();
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { folderMap, TrannslateFolder, fileMap, Route, current } =
    folderContext;

  const handleCopy = () => {
    let moveTo: any;
    let from: any;
    let newFileId: any;
    if (file.type == "file") {
      moveTo = folderMap.get(address);
      from = folderMap.get(file.address.split("/").slice(0, -1).join("/"));
      // console.log(moveTo);
      // const files = fileMap.get(file.id);
      const newFile = new File(file, current, "yes");
      newFile.rename("Copy of" + newFile.name);
      newFileId = moveTo.addFile(newFile, null, { flag: false });
      fileMap.set(newFileId.id, newFileId);
      console.log(newFile);
      // console.log({ moveTo, from, id: file.id });
      if (close.current) close.current?.click();

      setTimeout(() => Route(from.address, true), 800);
    } else if (file.type == "folder") {
      moveTo = folderMap.get(address);
      const parentAddress = file.address.split("/").slice(0, -1).join("/");
      const folder = folderMap.get(file.address);
      const newData = moveTo.addFolder(folder);
      newFileId = newData.key;
      folderMap.set(newData.address, newData);
      TrannslateFolder.set(newData.key, newData.name);
      close.current?.click();
      setTimeout(() => Route(parentAddress, true), 200);
    }

    toLocalStorage({ folders: moveTo, flag: true });
    toLocalStorage({ folders: from, flag: true });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          ref={ref}
          className="relative flex cursor-default select-none text-black h-fit bg-white items-center text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 py-0.5 px-3 focus:bg-[#017aff] focus:text-white rounded-[4px] hover:bg-[#017aff] justify-start w-full  hover:text-white"
        >
          Copy
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[600px] h-[500px] w-[90%] outline-0 rounded">
        <SidebarProvider className="items-start">
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden p-4">
            <h1
              className="px-3 scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl"
              style={{
                width: "555px",
                height: "46px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Copy: {file.name}
            </h1>
            <div className="px-3 flex flex-row items-center gap-4">
              <div className="text-xs text-muted-foreground">
                Current: <code>{file.address || "—"}</code>
              </div>
            </div>

            <Separator />
            <Move
              folderMap={folderMap}
              TrannslateFolder={TrannslateFolder}
              setAddress={setAddress}
            />

            <div className="flex flex-row justify-between items-center pt-7">
              <div className="icon">
                <svg
                  className="pl-2"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" />
                </svg>
              </div>
              <div className="flex flex-row self-end">
                <DialogClose
                  className="w-fit inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-fit"
                  ref={close}
                >
                  Cancel
                </DialogClose>
                <Button
                  disabled={
                    file.address.split("/").slice(0, -1).join("/") == address
                  }
                  className="w-fit"
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
});

export default Copy;
