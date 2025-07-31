import { InView } from "@/components/ui/in-view";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataContext } from "../context";
import * as React from "react";

export function CreateWorkspace({
  setPage,
  page,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const data = React.useContext(dataContext);

  if (!data) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { workspace, setWorkspace } = data;

  return (
    <InView
      variants={{
        hidden: { opacity: 0, filter: "blur(4px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
      }}
      viewOptions={{ margin: "0px 0px -200px 0px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <section className="flex flex-col items-center gap-16">
          <div className="flex items-center flex-col">
            <h4 className="scroll-m-20 text-[1.3rem] dark:text-[#ffffffcf] text-black md:text-2xl font-semibold tracking-tight">
              Create a workspace
            </h4>
            <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#555c5d]">
              This is how Workspace apear on colabtube
            </h4>
          </div>

          <div className="form grid w-full max-w-sm items-center gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Name" className="pl-1">
                Give a name to your World
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                defaultValue={workspace}
                onInput={(e: any) => {
                  setWorkspace(e.target.value);
                }}
                className="focus-visible:border-ring focus-visible:border-input focus-visible:ring-[#4292E1] focus-visible:ring-[3px] "
              />
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button
              onClick={() => setPage(page + 1)}
              className="hover:bg-[rgb(0,119,212)] bg-[#2383e2] dark:text-white"
              disabled={workspace.length == 0}
            >
              Continue
            </Button>
          </div>
        </section>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </InView>
  );
}
