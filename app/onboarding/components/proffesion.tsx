import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { InView } from "@/components/ui/in-view";
import { proffesions as selection } from "../dataLibrary";
import { dataContext } from "../context";

export function Profession({
  page,
  setPage,
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
  const { Proffesion, setProfession } = data;

  const card = (selection: any, i: number) => {
    return (
      <div
        className="card"
        style={{ cursor: "pointer" }}
        key={i}
        onClick={() => {
          setProfession(selection);
        }}
      >
        <div
          className={`border-input border-[1px] bg-transparent  py-4 px-6 rounded-xl flex flex-col gap-3 `}
          style={
            Proffesion == selection
              ? {
                  width: "calc((.25rem) * 74)",
                  transition: "200ms",
                  justifyContent: "center", // Corrected here
                  borderRadius: "12px",
                  borderColor: "rgb(35, 130, 226)",
                  borderWidth: "1px",
                  boxShadow:
                    "rgb(35, 131, 226) 0px 0px 0px 2px, rgba(182, 182, 182, 0.25) 0px 8px 12px",
                }
              : Proffesion != ""
              ? { opacity: 0.7, width: "calc((.25rem) * 74)" }
              : { width: "calc((.25rem) * 74)" }
          }
        >
          <h4 className="scroll-m-20 dark:text-[#ffffffcf] text-md font-semibold tracking-tight">
            {selection}
          </h4>
        </div>
      </div>
    );
  };

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
        <section className="flex flex-col item-center gap-16">
          <div className="flex items-center flex-col text-center">
            <h4 className="scroll-m-20 text-[1.2rem] md:text-2xl font-semibold tracking-tight">
              Tell us About youself
            </h4>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#555c5d]">
              What kind of work do you do.
            </h4>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="grid gap-2 grid gridContainer ">
              {selection.map((data: any, i: any) => card(data, i))}
            </div>
          </div>

          {Proffesion == "Other" && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Name" className="pl-1">
                What you do?
              </Label>
              <Input
                type="text"
                id="Other"
                placeholder="Other"
                className="focus-visible:border-ring focus-visible:ring-[#4292E1] focus-visible:ring-[3px] "
              />
            </div>
          )}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button
              className="dark:text-white hover:bg-[rgb(0,119,212)] bg-[#2383e2]"
              disabled={Proffesion == ""}
              onClick={() => setPage(page + 1)}
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
