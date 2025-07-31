import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import * as React from "react";
import { hoby as selection } from "../dataLibrary";
import { dataContext } from "../context";

export function Hobby({
  page,
  setPage,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const data = React.useContext(dataContext);
  const [flag, setFlag] = React.useState<boolean>(false);
  if (!data) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { intrrest, setIntrrest } = data;

  const card = (select: any, i: number) => {
    return (
      <div
        className="card dark:bg-[#0a0a0a] bg-white"
        style={{ cursor: "pointer" }}
        key={i}
        onClick={() => {
          if (intrrest.includes(select)) {
            const new_Arrray = intrrest.filter((data) => data != select);
            setIntrrest(new_Arrray);
          } else {
            const new_array = intrrest;
            new_array.push(select);
            setIntrrest(new_array);
            console.log(intrrest);
          }
          setFlag(!flag);
        }}
      >
        <div
          className={`border-input border-1 bg-transparent  py-2 px-5 items-center rounded-xl flex flex-col gap-3 `}
          style={
            intrrest.includes(select)
              ? {
                  transition: "200ms",
                  mixBlendMode: "normal",
                  justifyContent: "center", // Corrected here
                  borderRadius: "12px",
                  borderColor: "rgb(35, 130, 226)",
                  borderWidth: "1px",
                  boxShadow:
                    "rgb(35, 131, 226) 0px 0px 0px 2px, rgba(182, 182, 182, 0.25) 0px 8px 12px",
                }
              : intrrest.length > 0
              ? { opacity: 0.7, mixBlendMode: "luminosity" }
              : { mixBlendMode: "luminosity" }
          }
        >
          <h4 className="scroll-m-20 dark:text-[#ffffffcf] text-sm md:text-md font-semibold tracking-tight">
            {select}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <>
      <InView
        variants={{
          hidden: { opacity: 0, filter: "blur(4px)" },
          visible: { opacity: 1, filter: "blur(0px)" },
        }}
        viewOptions={{ margin: "0px 0px -200px 0px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <section className="flex flex-col md:items-start items-center gap-16">
            <div className="flex items-center md:items-start flex-col text-center md:text-left">
              <h4 className="scroll-m-20 text-[1.2rem] md:text-2xl font-semibold tracking-tight">
                {"What's on your mind?"}
              </h4>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#555c5d]">
                Select as many as you want.
              </h4>
            </div>

            <div className="flex flex-col gap-1 ">
              <h4 className="scroll-m-20 dark:text-[#ffffffcf] text-md font-semibold tracking-tight pl-2">
                {intrrest.length + " selected"}
              </h4>
              <div className="flex gap-2 flex-wrap">
                {selection.map((data: any, i: any) => card(data, i))}
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Button
                className="dark:text-white hover:bg-[rgb(0,119,212)] bg-[#2383e2]"
                disabled={false}
                onClick={() => setPage(page + 1)}
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  setPage(page + 1);
                  setIntrrest([]);
                }}
                variant="ghost"
                className="text-muted-foreground"
              >
                Skip for now
              </Button>
            </div>
          </section>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </InView>
    </>
  );
}
