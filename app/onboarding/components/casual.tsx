import { InView } from "@/components/ui/in-view";
import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataContext } from "../context";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { storeThumbnailLocally } from "@/app/file-space/components/uploads";

export function LoginForm({
  setPage,
  page,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const data = React.useContext(dataContext);
  const AvatarImg = React.useRef<HTMLImageElement>(null);
  const AvtarInput = React.useRef<HTMLInputElement>(null);
  const [changed, isChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (Avtar && AvatarImg.current) {
      AvatarImg.current.src = URL.createObjectURL(Avtar);
      isChanged(true);
    }
  }, []);

  if (!data) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }
  const { name, setName, dob, setDob, Avtar, setAvtar } = data;

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
              Create a profile
            </h4>
            <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#555c5d]">
              {"This is how you'll apear on cloudshare"}
            </h4>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              onClick={() => {
                AvtarInput.current?.click();
              }}
              className={`circle h-20 w-20 aspect-1/1 bg-[#26262661] rounded-[50%]`}
              style={{ cursor: "pointer" }}
            >
              <img
                className="circle h-20 w-20 aspect-1/1 bg-accent rounded-[50%] bg-cover filter"
                src="./smiley_calm_emotavatar_icon_133479.webp"
                ref={AvatarImg}
                style={
                  !changed
                    ? {
                        mixBlendMode: "luminosity",
                        filter: "brightness(2)",
                      }
                    : {
                        mixBlendMode: "normal",
                        filter: "",
                        objectFit: "cover",
                        objectPosition: "top",
                      }
                }
                alt=""
              />
            </div>
            <div className="inline-flex" style={{ cursor: "pointer" }}>
              <ImagePlus
                className="text-muted-foreground h-5"
                style={{ cursor: "pointer" }}
              />
              <p
                className="text-muted-foreground text-sm"
                style={{ cursor: "pointer" }}
              >
                {!changed ? "Add a photo" : "Change"}
              </p>
            </div>
            <input
              type="file"
              name=""
              id=""
              ref={AvtarInput}
              className="hidden"
              onInput={(e: any) => {
                setAvtar(e.target.files[0]);
                if (AvatarImg.current)
                  AvatarImg.current.src = URL.createObjectURL(
                    e.target.files[0]
                  );
                isChanged(true);
                storeThumbnailLocally(e.target.files[0], "Avatar");
                localStorage.setItem(
                  "Avatar",
                  URL.createObjectURL(e.target.files[0])
                );
              }}
            />
          </div>

          <div className="form grid w-full max-w-sm items-center gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Name" className="pl-1">
                What should we call you?
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                defaultValue={name}
                onInput={(e: any) => {
                  setName(e.target.value);
                }}
                className="focus-visible:border-ring focus-visible:border-input focus-visible:ring-[#4292E1] focus-visible:ring-[3px] "
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="Age" className="pl-1">
                Your Age
              </Label>
              <Calendar22 DOB={setDob} dob={dob} />
            </div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Button
              onClick={() => setPage(page + 1)}
              className="hover:bg-[rgb(0,119,212)] bg-[#2383e2] dark:text-white"
              disabled={dob == undefined || name.length == 0}
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

export function Calendar22({
  DOB,
  dob,
}: {
  DOB: React.Dispatch<React.SetStateAction<Date | undefined>>;
  dob?: Date;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const today = new Date();
  const minDOB = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const maxDOB = new Date(
    today.getFullYear() - 15,
    today.getMonth(),
    today.getDate()
  );

  React.useEffect(() => {
    if (dob) setDate(dob);
  }, [dob]);

  return (
    <div className="flex flex-col gap-3 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={`justify-between font-normal ${
              !date ? "text-muted-foreground" : ""
            }`}
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            className="w-[85vw] md:w-95"
            mode="single"
            selected={date}
            captionLayout="dropdown"
            defaultMonth={date ?? maxDOB}
            onSelect={(date) => {
              DOB(date);
              setDate(date);
              setOpen(false);
            }}
            disabled={{ before: minDOB, after: maxDOB }} // 👈 Only allow DOBs between 18–100 years ago
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
