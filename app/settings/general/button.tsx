"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MorphingIcon({ data }: { data: string }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    setIsChecked(true);
    // Reset back to copy icon after 2 seconds
    setTimeout(() => setIsChecked(false), 2000);
  };

  const simulateCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      handleClick();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button onClick={simulateCopy} variant="outline" className="bg-transparent">
      <div className="relative ">
        <Copy className={"invisible"} />
        <Copy
          height={24}
          className={cn(
            "absolute inset-0 transition-all duration-400 ease-out",
            isChecked ? "opacity-0 scale-0" : "opacity-100 scale-100"
          )}
        />
        <CheckCheck
          height={30}
          width={30}
          className={cn(
            "absolute inset-0 transition-all duration-400 ease-out text-green-600",
            isChecked ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}
        />
      </div>
    </Button>
  );
}
