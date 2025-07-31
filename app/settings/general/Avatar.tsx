"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { storeThumbnailLocally } from "@/app/file-space/components/uploads";
import { Files } from "@/app/file-space/utilities/localDB/db";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

interface CropArea {
  x: number;
  y: number;
  size: number; // size used instead of width/height to enforce 1:1
}

export function Component() {
  // const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState("");

  const session = useSession();

  const [cropArea, setCropArea] = useState<CropArea>({
    x: 30,
    y: 30,
    size: 200,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState("");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const avtarRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (session) {
      const { data } = session;
      // console.log(session);
      if (data && data.user && data.user.image)
        setCroppedImage(data.user.image);
    }
    const fileUrl = async () => {
      const fileRecord = await Files.get(`thumbnail/Avatar`);
      console.log(fileRecord);

      if (!fileRecord) return null;

      const blobUrl = URL.createObjectURL(fileRecord.blob);
      setCroppedImage(blobUrl);
    };
    void (async () => await fileUrl())();
  }, []);

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else {
      return {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.files = new DataTransfer().files;
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setIsOpen(true);
    }
  };

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, handle: string) => {
      e.preventDefault();
      e.stopPropagation();
      const pos = getEventPosition(e.nativeEvent);
      setIsDragging(true);
      setDragHandle(handle);
      setDragStart({ x: pos.x, y: pos.y });
    },
    []
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const pos = getEventPosition(e);
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;
      const containerRect = containerRef.current.getBoundingClientRect();

      setCropArea((prev) => {
        const newArea = { ...prev };

        switch (dragHandle) {
          case "move": {
            const newX = prev.x + deltaX;
            const newY = prev.y + deltaY;
            newArea.x = Math.max(
              0,
              Math.min(containerRect.width - prev.size, newX)
            );
            newArea.y = Math.max(
              0,
              Math.min(containerRect.height - prev.size, newY)
            );
            break;
          }

          case "nw": {
            const change = Math.min(deltaX, deltaY) * -1;
            const newSize = Math.max(50, prev.size + change);
            const newX = prev.x - (newSize - prev.size);
            const newY = prev.y - (newSize - prev.size);

            if (newX >= 0 && newY >= 0) {
              newArea.size = newSize;
              newArea.x = newX;
              newArea.y = newY;
            }
            break;
          }

          case "ne": {
            const change = Math.min(-deltaX, deltaY) * -1;
            const newSize = Math.max(50, prev.size + change);
            const newY = prev.y - (newSize - prev.size);

            if (prev.x + newSize <= containerRect.width && newY >= 0) {
              newArea.size = newSize;
              newArea.y = newY;
            }
            break;
          }

          case "sw": {
            const change = Math.min(deltaX, -deltaY) * -1;
            const newSize = Math.max(50, prev.size + change);
            const newX = prev.x - (newSize - prev.size);

            if (prev.y + newSize <= containerRect.height && newX >= 0) {
              newArea.size = newSize;
              newArea.x = newX;
            }
            break;
          }

          case "se": {
            const change = Math.max(deltaX, deltaY);
            const newSize = Math.min(
              Math.max(50, prev.size + change),
              containerRect.width - prev.x,
              containerRect.height - prev.y
            );
            newArea.size = newSize;
            break;
          }
        }

        return newArea;
      });

      setDragStart({ x: pos.x, y: pos.y });
    },
    [isDragging, dragHandle, dragStart]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragHandle("");
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const cropImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !containerRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;
    const container = containerRef.current;

    if (!ctx) return;

    const scaleX = img.naturalWidth / container.offsetWidth;
    const scaleY = img.naturalHeight / container.offsetHeight;

    canvas.width = cropArea.size;
    canvas.height = cropArea.size;

    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.size * scaleX,
      cropArea.size * scaleY,
      0,
      0,
      cropArea.size,
      cropArea.size
    );
    canvas.toBlob((blob) => {
      if (!blob) return;
      const thumbFile = new File([blob], "Avatar.png", {
        type: "image/png",
      });
      storeThumbnailLocally(thumbFile, "Avatar");
    }, "image/png");
    const url = canvas.toDataURL("image/png");
    setCroppedImage(url);
    localStorage.setItem("Avatar", url);
    window.dispatchEvent(new Event("local-storage-updated"));
  }, [cropArea]);

  const handleSetAvatar = () => {
    cropImage();
    setIsOpen(false);
  };

  const resetCrop = () => {
    setCropArea({ x: 50, y: 30, size: 200 });
  };

  return (
    <>
      <Avatar
        onClick={() => avtarRef.current?.click()}
        style={{ cursor: "pointer" }}
        className="h-[100px] w-[100px] hover:brightness-90 active:border-[1px] active:border-black border-[1px] border-transparent p-[1px] rounded-full"
      >
        <AvatarImage
          draggable={false}
          style={{ cursor: "pointer", objectFit: "cover" }}
          src={croppedImage || "https://github.com/shadcn.png"}
          className="rounded-full"
        />
        <AvatarFallback className="h-full rounded-full">CN</AvatarFallback>
      </Avatar>

      <input
        ref={avtarRef}
        id="image-upload"
        type="file"
        accept="image/*"
        onInput={handleImageUpload}
        className="hidden"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="hidden"></DialogTitle>
        <DialogContent className="max-w-[70vw] p-0 ">
          <div
            className="bg-gray-50 p-6"
            style={{ overflowY: "auto", height: "100%" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Your Avatar</h3>
              <Button onClick={resetCrop} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>

            <div className="relative w-full max-w-[600px] mx-auto">
              <div
                ref={containerRef}
                className="relative w-full bg-white overflow-hidden shadow-inner border"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Avatar preview"
                  className="w-full h-auto object-contain max-h-[70vh] select-none"
                  draggable={false}
                />

                {/* Crop Box */}

                <div
                  className="absolute border-2 border-dashed border-white cursor-move"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.size,
                    height: cropArea.size,
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                  }}
                  onMouseDown={(e) => handleDragStart(e, "move")}
                  onTouchStart={(e) => handleDragStart(e, "move")}
                >
                  {/* NW */}
                  <div
                    className="absolute w-3 h-3 bg-white border border-gray-400 cursor-nw-resize -top-1 -left-1"
                    onMouseDown={(e) => handleDragStart(e, "nw")}
                    onTouchStart={(e) => handleDragStart(e, "nw")}
                  />
                  {/* NE */}
                  <div
                    className="absolute w-3 h-3 bg-white border border-gray-400 cursor-ne-resize -top-1 -right-1"
                    onMouseDown={(e) => handleDragStart(e, "ne")}
                    onTouchStart={(e) => handleDragStart(e, "ne")}
                  />
                  {/* SW */}
                  <div
                    className="absolute w-3 h-3 bg-white border border-gray-400 cursor-sw-resize -bottom-1 -left-1"
                    onMouseDown={(e) => handleDragStart(e, "sw")}
                    onTouchStart={(e) => handleDragStart(e, "sw")}
                  />
                  {/* SE */}
                  <div
                    className="absolute w-3 h-3 bg-white border border-gray-400 cursor-se-resize -bottom-1 -right-1"
                    onMouseDown={(e) => handleDragStart(e, "se")}
                    onTouchStart={(e) => handleDragStart(e, "se")}
                  />
                </div>

                {/* Crop Box */}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>Drag to move or resize — always 1:1 square crop</p>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSetAvatar}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Set Avatar
            </Button>
          </DialogFooter>

          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
