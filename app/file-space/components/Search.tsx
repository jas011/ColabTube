"use client";
import { File, Folder } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useFolder } from "../context/context";

export function CommandDemo() {
  const [focus, setFocus] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);

  const folderContext = useFolder();
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { fileMap, folderMap, Route } = folderContext;

  const folder = Array.from(folderMap.values());
  const files = Array.from(fileMap.values()).concat(
    folder.filter((f) => f.key != "root")
  );

  return (
    <Command
      onFocus={() => setFocus(true)}
      onBlur={() => setTimeout(() => setFocus(false), 200)}
      className="rounded-lg border md:min-w-[450px] w-[40%] md:top-[24%] md:left-[28%] left-[27%] top-[24%] "
      style={{
        position: "absolute",
        height: "fit-content",
      }}
    >
      <CommandInput
        className={
          "mb-0 mx-0 flex w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed outline-none disabled:opacity-50 md:text-sm h-auto lg:w-1/2 text-center" +
          " m-[1px] p-0 md:p-1"
        }
        style={{ width: "auto" }}
        onInput={(e: any) =>
          e.target.value.length ? setFlag(true) : setFlag(false)
        }
        placeholder="🔍︎Search Folder or File"
      />
      <CommandList className={focus && flag ? "visible" : "hidden"}>
        <CommandEmpty>No results found.</CommandEmpty>
        {files.map((file: any) => (
          <CommandItem key={file.id || file.key || Math.random()}>
            <div
              className="flex gap-2 items-center"
              onClick={() => {
                if (file.type == "folder") {
                  console.log(file);
                  Route(file.address, true);
                } else if (file.type == "file") {
                  localStorage.setItem("find", file.id);
                  setTimeout(
                    () =>
                      Route(
                        file.address
                          .split("/")
                          .slice(0, file.address.split("/").length - 1)
                          .join("/"),
                        true
                      ),
                    100
                  );
                }
              }}
            >
              {file.type == "file" ? (
                <File height={20} />
              ) : (
                <Folder height={20} />
              )}
              <span>{file.name}</span>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
