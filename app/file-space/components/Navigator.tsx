"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useFolder } from "../context/context";

export function Navigator() {
  const folderContext = useFolder();

  const [w, setW] = useState<string>("");
  useEffect(
    () => setW(window.innerWidth - 270 < 800 ? "w-[100vw]" : "w-auto"),
    []
  );
  if (!folderContext) {
    // Handle the error or return fallback UI
    console.error("Folder context is undefined");
    return null;
  }

  const { TrannslateFolder, current, Route } = folderContext;
  const folderAddress = current;

  const address = folderAddress.split("/");
  const breadcrumb = [];
  for (let i = 0; i < address.length; i++) {
    if (i != address.length - 1) {
      breadcrumb.push(
        <BreadcrumbItem key={i}>
          <BreadcrumbLink
            onClick={() => {
              const folderAddress = address.slice(0, i + 1).join("/");
              console.log();
              // RenderFolder({
              //   folderAddress: address.slice(0, i + 1).join("/"),
              // });

              Route(folderAddress);
            }}
          >
            {TrannslateFolder.get(address[i])}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      breadcrumb.push(<BreadcrumbSeparator key={i + 0.012} />);
    } else {
      breadcrumb.push(
        <BreadcrumbItem key={i}>
          <BreadcrumbPage>{TrannslateFolder.get(address[i])}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
  }
  return (
    <Card className="w-full fixed bottom-0 py-0.5 navigator bg-[#f4f4f4] rounded-[0px] ">
      <CardContent className={`py-0 px-3 ${w}`} style={{ overflow: "auto" }}>
        <Breadcrumb className="text">
          <BreadcrumbList className="sm:gap-[1.5px] gap-[1.5px] flex-nowrap w-max ">
            {breadcrumb}
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  );
}
