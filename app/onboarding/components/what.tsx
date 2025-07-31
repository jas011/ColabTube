import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import * as React from "react";
import { Userr as selection } from "../dataLibrary";
import { dataContext } from "../context";

export function What({
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
  const { user, setUser } = data;

  const card = (selection: any, i: number) => {
    return (
      <div
        className="card scale-110 md:scale-100"
        key={i}
        onClick={() => {
          setUser(selection.title);
        }}
      >
        <div
          className={`border-input border-1 bg-transparent  py-6 px-8 rounded-xl text-center w-50 flex items-center flex-col gap-3 `}
          style={
            user == selection.title
              ? {
                  transition: "200ms",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center", // Corrected here
                  borderRadius: "12px",
                  borderColor: "rgb(35, 130, 226)",
                  borderWidth: "1px",
                  boxShadow:
                    "rgb(35, 131, 226) 0px 0px 0px 2px, rgba(182, 182, 182, 0.25) 0px 8px 12px",
                }
              : user == "" || user
              ? { opacity: 0.7 }
              : {}
          }
        >
          <img
            src={selection.src}
            alt=""
            className={i == 0 ? "w-[126px]" : "w-20"}
          />
          <div className="content">
            <h4 className="scroll-m-20 dark:text-[#ffffffcf] text-md font-semibold tracking-tight">
              {selection.title}
            </h4>
            <p className="text-sm dark:text-[#ffffff75] text-[#3c3c3cba] ">
              <b>{selection.desc}</b>
            </p>
          </div>
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
              How do you want to use colabtube?
            </h4>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#555c5d]">
              This helps coustomize your experience
            </h4>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-10 md:gap-3 items-center justify-center flex-wrap md:flex-nowrap">
              {selection.map((data: any, i: any) => card(data, i))}
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button
              className="dark:text-white hover:bg-[rgb(0,119,212)] bg-[#2383e2]"
              disabled={user == ""}
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
