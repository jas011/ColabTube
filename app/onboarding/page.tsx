"use client";
import { LoginForm } from "./components/casual";
import { Profession } from "./components/proffesion";
import * as React from "react";
import { ChevronLeftIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JoinWorkspace } from "./components/workspace";
import { Email } from "./components/Email";
import "./style.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hobby } from "./components/hobby";
import { LoadingScreen } from "./components/loadingscreen";
import { Context } from "./context";
import { CreateWorkspace } from "./components/CreateWorkspace";
import { SessionProvider } from "next-auth/react";
export default function LoginPage() {
  const { setTheme } = useTheme();
  const [page, setPage] = React.useState<number>(1);
  const [done, setDone] = React.useState<boolean>(false);

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <div className="bg-background flex min-h-svh md:min-h-[95vh] flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md md:mt-[-5%]">
              <LoginForm setPage={setPage} page={page} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-background flex min-h-svh md:min-h-[95vh] flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md md:mt-[-5%]">
              <Profession setPage={setPage} page={page} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-background flex flex-col gap-6 p-6 md:px-30 md:pt-30 md:pb-0 md:min-h-[95vh]">
            <div className="w-full max-w-md ">
              <Hobby setPage={setPage} page={page} />
            </div>

            <img
              src="./category-picker-large-darkmode.png"
              alt=""
              className="hidden md:flex absolute w-[65vw]"
              style={{
                bottom: 0,
                right: 0,
              }}
            />
          </div>
        );

      case 3:
        return (
          <div className="bg-background flex  flex-col items-center justify-center gap-6 p-6 md:p-10 md:min-h-[95vh]">
            <div className="w-full max-w-md md:mt-[-5%]">
              <JoinWorkspace setPage={setPage} page={page} setDone={setDone} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="bg-background flex  flex-col items-center justify-center gap-6 p-6 md:p-10 md:min-h-[95vh]">
            <div className="w-full max-w-md md:mt-[-5%]">
              <Email setdone={setDone} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-background flex min-h-svh md:min-h-[95vh] flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md md:mt-[-5%]">
              <CreateWorkspace setPage={setPage} page={page} />
            </div>
          </div>
        );
      // Add other cases if needed
      default:
        return null;
    }
  };

  return (
    <SessionProvider>
      <Progress value={((page - 1) / 5) * 100} className="w-full " />
      <div className={`flex flex-row justify-between`}>
        <Button
          variant="secondary"
          size="icon"
          disabled={done}
          className={`size-8 ${page == 1 ? "invisible" : "visible"}`}
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative w-full h-full ">
        <Context>
          {done && (
            <LoadingScreen
              style={{
                backdropFilter: "blur(2px) brightness(0.4)",
                animation: "opacitor 1s",
              }}
              className={`absolute w-full h-[100vh] flex justify-center items-center mt-[-10vh] md:mt-[-44px] z-[5] `}
            />
          )}
          <div>{renderPage()}</div>
        </Context>
      </div>
    </SessionProvider>
  );
}
