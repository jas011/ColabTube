import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useRef } from "react";
import { toLocalStorage } from "../utilities/DBFolder/dbFetchFolder";

import { useFolder } from "../context/context";
import Folder from "../utilities/structures/Folder";
import { FolderPlus } from "lucide-react";

export function updateFolder(
  foldername: string,
  { folderMap, current, Route, TrannslateFolder }: any
) {
  const folder = folderMap.get(current);
  const newFolder = folder.addFolder(new Folder(foldername));
  folderMap.set(newFolder.address, newFolder);
  TrannslateFolder.set(newFolder.key, newFolder.name);
  Route(current, true);
  console.log({ newFolder });

  toLocalStorage({ folders: [newFolder] });
  toLocalStorage({ folders: folder, flag: true });
}

export const DialogDemo = forwardRef<HTMLButtonElement>(() => {
  const foldername = useRef<string>("");
  const folderContext = useFolder();
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { folderMap, Route, current, TrannslateFolder, UploadEvent, session } =
    folderContext;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FolderPlus height={20} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new folder</DialogTitle>
          <DialogDescription>
            Enter the name of the folder you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Folder
            </Label>
            <Input
              onInput={(e: any) => (foldername.current = e.target.value)}
              id="name"
              placeholder="Folder"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() =>
                updateFolder(foldername.current, {
                  folderMap,
                  Route,
                  current,
                  TrannslateFolder,
                  UploadEvent,
                  session,
                })
              }
              type="submit"
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
