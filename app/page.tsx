import { AppSidebar } from "@/components/app-sidebar";
import { Navigator } from "./file-space/components/Navigator";
import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AnimatedGroup } from "@/components/ui/animated-group";

export default function Page() {
  return (
    <AnimatedGroup
      className="a"
      variants={{
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        },
        item: {
          hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: 1.7,
              type: "spring",
              bounce: 0.3,
            },
          },
        },
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4"></div>
          </header>
          {/* <Vid></Vid> */}
          <Navigator />
        </SidebarInset>
      </SidebarProvider>
    </AnimatedGroup>
  );
}
