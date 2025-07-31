"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// import { Input } from "@/components/ui/input";

import "./style.css";

// import { Button } from "@/components/ui/button";
import { Component } from "./Avatar";
import { Badge } from "@/components/ui/badge";
// import MorphingIcon from "./button";
import { useEffect, useState } from "react";

export default function Gernal() {
  const [user, setUser] = useState<any>();
  // const [name, setName] = useState<string>("");

  useEffect(() => {
    const intrested = () => {
      const user = localStorage.getItem("onboarding");
      if (!user) return null;
      setUser(JSON.parse(user));
    };
    intrested();
  }, []);

  const parseDate = (d: string) => {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(d);
    const day = date.getDate();
    const year = date.getFullYear();
    const mon = month[date.getMonth()];

    return `${day} ${mon} ${year}`;
  };
  // const CardMaster = () => {
  //   return (
  //     <Card className="flex flex-col  py-6-sm pb-0 poppins-medium max-w-[912px]">
  //       <CardHeader className="pb-3">
  //         <CardTitle className="flex flex-col gap-2.5 ">
  //           <p className="scroll-m-20 text-[20px] font-no tracking-tight geist ">
  //             Team Name
  //           </p>
  //           <p
  //             className="text-[14px] leading-none font-normal geist"
  //             style={{ lineHeight: "24px" }}
  //           >
  //             This is your team&apos;s visible name within Colabtube. For
  //             example, the name of your company or department.
  //           </p>
  //         </CardTitle>
  //       </CardHeader>

  //       <CardContent className="px-6">
  //         <Input
  //           type="text"
  //           placeholder="Team Name"
  //           className="max-w-[288px] text-[14.5px] geist"
  //         />
  //       </CardContent>
  //       <CardFooter className="items-center md:py-3 md:px-6 bg-[#fafafa] flex justify-between rounded-b-xl border-t flex-col md:flex-row gap-3 p-5">
  //         <p className="text-muted-foreground text-sm geist">
  //           Please use 32 characters at maximum.
  //         </p>
  //         <Button variant="default" className="py-0 px-4 geist">
  //           Save
  //         </Button>
  //       </CardFooter>
  //     </Card>
  //   );
  // };
  // const CardMaster3 = () => {
  //   return (
  //     <Card className="flex flex-col  py-6-sm pb-0 poppins-medium max-w-[912px]">
  //       <CardHeader className="pb-3">
  //         <CardTitle className="flex flex-col gap-2.5 ">
  //           <p className="scroll-m-20 text-[20px] font-no tracking-tight geist ">
  //             Team Name
  //           </p>
  //           <p
  //             className="text-[14px] leading-none font-normal geist"
  //             style={{ lineHeight: "24px" }}
  //           >
  //             This is your team{"'"}s ID within cloudshare.
  //           </p>
  //         </CardTitle>
  //       </CardHeader>

  //       <CardContent
  //         className="px-6 flex-row flex relative"
  //         style={{ cursor: "pointer" }}
  //       >
  //         <Input
  //           disabled
  //           value={"team_WnaA0Rwcy1KgR2cS8V6xFVnv"}
  //           type="email"
  //           className="max-w-[288px] text-[14.5px] geist text-[#09090b]"
  //           style={{
  //             opacity: 100,
  //             cursor: "pointer",
  //             userSelect: "all",
  //           }}
  //           placeholder="Email"
  //         />
  //         <MorphingIcon data="team_WnaA0Rwcy1KgR2cS8V6xFVnv" />
  //       </CardContent>
  //       <CardFooter className="items-center md:py-3 md:px-6 bg-[#fafafa] flex justify-between rounded-b-xl border-t flex-col md:flex-row gap-3 p-5">
  //         <p className="text-muted-foreground text-sm geist">
  //           Used when interacting with the support.
  //         </p>
  //       </CardFooter>
  //     </Card>
  //   );
  // };

  const CardMaster2 = () => {
    return (
      <Card className="flex flex-col  py-6-sm pb-0 poppins-medium max-w-[912px]">
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-row justify-between gap-10"></CardTitle>
        </CardHeader>

        <CardContent className="px-6">
          <div className="flex  gap-[32px]">
            <Component />
            <div className="space-y-0.5">
              <Badge variant="secondary" className=" text-xs geist">
                <small className="text-sm leading-none font-medium">
                  @Master
                </small>
              </Badge>

              <h2 className=" text-xl font-semibold tracking-tight ">
                {user && user.name && <span>{user && user.name}</span>}{" "}
                {user && user.Proffesion && (
                  <span>– {user && user.Proffesion}</span>
                )}
              </h2>

              {user && user.intrrest.join(" • ") && (
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {user && user.intrrest.join(" • ")}
                </code>
              )}

              {user && user.joined && (
                <div className="text-muted-foreground text-xs pt-[8px]">
                  Joined {parseDate(user && user.joined)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="items-center md:py-3 md:px-6 bg-[#fafafa] flex justify-between rounded-b-xl border-t flex-col md:flex-row gap-3 p-5">
          <p className="text-muted-foreground text-sm geist">
            Master role is reserved for the person who first created this team.
          </p>
        </CardFooter>
      </Card>
    );
  };
  return (
    <div className="flex gap-[32px] flex-col w-full h-full">
      <CardMaster2 />
      {/* <CardMaster />

      <CardMaster3 /> */}
    </div>
  );
}
