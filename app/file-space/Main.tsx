// app/file-space/Main.tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import { useFolder } from "./context/context";
import { useSearchParams } from "next/navigation";

export function Main() {
  const searchParams = useSearchParams();
  const folderId = searchParams?.get("folder") || "root";

  const videotile = useRef<HTMLDivElement | null>(null);
  const folderContext = useFolder();

  // State to avoid flickering during folder changes

  useEffect(() => {
    if (!folderContext?.hasData) return;
    // console.clear();
    // console.log(FolderContent);
    // Only render if folderId has changed
    if (folderContext?.current != folderId) {
      console.log(
        folderContext?.current,
        folderId,
        folderContext?.current != folderId
      );
      folderContext?.RenderFolder({ folderAddress: folderId });
    }
  }, [folderContext?.hasData, folderId]);

  // Initial folder render
  useEffect(() => {
    setTimeout(() => {
      const resizeEvent = new UIEvent("resize", { bubbles: true });
      window.dispatchEvent(resizeEvent);
    }, 500);

    const resize = () => {
      if (videotile.current) {
        const top = videotile.current.getBoundingClientRect().top;
        const height =
          window.screen.availHeight > 880
            ? window.screen.availHeight - top - 150
            : window.innerHeight - top - 20;

        videotile.current.style.height = `${height}px`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!folderContext) {
    console.error("Folder context is undefined");
    return null;
  }

  const { FolderContent } = folderContext;

  return (
    <Suspense fallback={<div />}>
      <div
        className="videoTile transition-opacity duration-300"
        ref={videotile}
      >
        {FolderContent}
      </div>
    </Suspense>
  );
}
