"use client";
import { InView } from "@/components/ui/in-view";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataContext } from "../context";
import * as React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Email({
  setdone,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  setdone: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const data = React.useContext(dataContext);
  const session = useSession();
  const router = useRouter();
  const [indexer, setIndexer] = React.useState<string[]>(["", "", ""]);
  if (!session || !session.update) {
    // Handle the missing session gracefully (e.g., redirect or fallback UI)
    return <p>Loading or no session available</p>;
  }
  const { update } = session;

  const handleSubmit = async (data: any) => {
    console.log(data);
    setdone(true); // ✅ mark completion
    console.log("Submitting onboarding data:", data);
    document.cookie = "onboarded=true; path=/";
    const res = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ data }),
    });

    if (res.ok) {
      // ✅ Save onboarding data locally
      localStorage.setItem(
        "onboarding",
        JSON.stringify({ ...data, joined: Date.now() })
      );

      // ✅ Also set a cookie to inform server

      await update(); // ✅ re-fetch session from server, which triggers jwt() again
      console.log("Onboarding complete, redirecting...");
      router.push("/file-space");
    } else {
      console.error("Onboarding failed:", await res.text());
    }
  };

  if (!data) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }

  const { name, dob, intrrest, Proffesion, workspace } = data;

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
              Start with your team
            </h4>
            <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#555c5d]">
              colabtube works best with you teammates
            </h4>
          </div>

          <div className="form grid w-full max-w-sm items-center gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Name" className="pl-1 text-muted-foreground">
                Invite people
              </Label>
              {indexer.map((data: string, i: number) => (
                <Input
                  key={i}
                  type="email"
                  id="name"
                  placeholder="email"
                  defaultValue={data}
                  disabled
                  onInput={(e: any) => {
                    setIndexer(
                      indexer.map((data: string, index: number) =>
                        i == index ? e.target.value : data
                      )
                    );
                  }}
                  className="focus-visible:border-ring focus-visible:ring-[#4292E1] focus-visible:ring-[3px] h-7.5"
                />
              ))}
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button
              onClick={() => {
                handleSubmit({
                  name,
                  dob,
                  intrrest,
                  Proffesion,
                  workspace,
                  email: session.data?.user.email,
                });
              }}
              className="hover:bg-[rgb(0,119,212)] bg-[#2383e2] dark:text-white"
              disabled={indexer.length == 0}
            >
              Continue
            </Button>
            <Button
              onClick={() => {
                handleSubmit({ name, dob, intrrest, Proffesion, workspace });
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
  );
}
