import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import * as React from "react";
import { InView } from "@/components/ui/in-view";
// import { proffesions as selection } from "./dataLibrary";
// import { dataContext } from "../context";
import { TextMorph } from "@/components/ui/text-morph";

// const selection = [
//   {
//     workspace: "hello",
//     workspaceID: "7987dscvf",
//     role: "Manager",
//     members: 2,
//   },
//   {
//     workspace: "hello123",
//     workspaceID: "798sddcvf",
//     role: "Editors",
//     members: 2,
//   },
// ];
// selection;

export function JoinWorkspace({
  page,
  setPage,

  className,
  ...props
}: React.ComponentProps<"div"> & {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setDone: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const [selectedCard, setSelectedCard] = React.useState<number>(-1);
  // const data = React.useContext(dataContext);
  // if (!data) {
  //   // Handle the error or return fallback UI
  //   console.error("Folder context is undefined");
  //   return null;
  // }
  // const { Proffesion, setProfession } = data;

  // React.useEffect(() => {
  //   if (Proffesion) {
  //     for (const i in selection) {
  //       if (Proffesion == selection[i]) {
  //         setSelectedCard(parseInt(i));
  //         break;
  //       }
  //     }
  //   }
  // });

  // const card = (selection: any, i: number) => {
  //   return (
  //     <div
  //       className="card "
  //       style={{ cursor: "pointer" }}
  //       key={i}
  //       // onClick={() => {
  //       //   setSelectedCard(i);
  //       // }}
  //     >
  //       <div
  //         className={`border-input border-1 dark:bg-[#252525] w-[80vw] md:w-105 p-4 pb-3 rounded-xl flex flex-col gap-3 `}
  //         // style={
  //         //   selectedCard === i
  //         //     ? {
  //         //         transition: "200ms",

  //         //         justifyContent: "center", // Corrected here
  //         //         borderRadius: "12px",
  //         //         borderColor: "rgb(35, 130, 226)",
  //         //         borderWidth: "1px",
  //         //         boxShadow:
  //         //           "rgb(35, 131, 226) 0px 0px 0px 2px, rgba(182, 182, 182, 0.25) 0px 8px 12px",
  //         //       }
  //         //     : {}
  //         // }
  //       >
  //         <div className="flex">
  //           <div className="dark:bg-[#3a3a3a] bg-[#e4e4e7] w-fit h-fit py-1 px-3.5 m-0 rounded-lg text-2xl">
  //             {selection.workspace[0]}
  //           </div>
  //           <div className="flex justify-between w-full">
  //             <div className="flex flex-col gap-2 pl-4">
  //               <div className="flex flex-col ">
  //                 <h4 className="scroll-m-20 text-xl font-semibold tracking-tight ">
  //                   {selection.workspace}
  //                 </h4>
  //                 <small className="text-sm font-medium text-[#555c5d] mt-[-5px]">
  //                   {selection.members} members
  //                 </small>
  //               </div>
  //               <small className="text-sm leading-none font-medium text-muted-foreground">
  //                 {selection.role}
  //               </small>
  //             </div>
  //             <ConfettiSideCannons setDone={setDone} />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

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
          <div className="flex items-center flex-col text-center">
            <h4 className="scroll-m-20 text-[1.2rem] md:text-2xl font-semibold tracking-tight">
              Join Teammates or create a workspace
            </h4>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="grid gap-3 grid">No Invites Yet</div>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            {/* <Button
              className="dark:text-white hover:bg-[#55555c] bg-[#71717a]"
              onClick={() => setPage(page + 1)}
            >
              Continue with workspace
            </Button> */}
            <Button
              className="dark:text-white hover:bg-[rgb(0,119,212)] bg-[#2383e2]"
              onClick={() => setPage(page + 1)}
            >
              Create Workspace
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

export function ConfettiSideCannons({
  setDone,
}: {
  setDone: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [role, setRole] = React.useState<string>("Join");
  const handleClick = () => {
    setRole(role === "Join" ? "Leave" : "Join");

    const end = Date.now() + 1 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    if (role === "Join") frame();
    setDone(true);
  };

  return (
    <div className="relative">
      <small
        onClick={handleClick}
        className={`text-sm leading-none font-medium pt-1 text-[#2693fe] pr-2 ${
          role === "Leave" ? "text-[#dc2626]" : ""
        }`}
      >
        <TextMorph>{role}</TextMorph>
      </small>
    </div>
  );
}
