"use client";

import { TextEffect } from "@/components/ui/text-effect";
import { Separator } from "@/components/ui/separator";

import "./style.css";

function Thumbnail({ state }: { state: boolean }) {
  return (
    <>
      {state && (
        <div className="head">
          <h1>
            <TextEffect
              preset="fade-in-blur"
              speedReveal={1.1}
              speedSegment={0.3}
            >
              Team1&apos;s Assets
            </TextEffect>
          </h1>

          <h5>
            <TextEffect
              preset="fade-in-blur"
              speedReveal={1.1}
              speedSegment={0.3}
            >
              Here&apos;s a summary of your recent uploads and tasks. Let&apos;s
              get productive!
            </TextEffect>
          </h5>
        </div>
      )}
      {!state && (
        <div className="head">
          <h1>Team1&apos;s Assets</h1>

          <h5>
            Here&apos;s a summary of your recent uploads and tasks. Let&apos;s
            get productive!
          </h5>
        </div>
      )}

      <Separator />
    </>
  );
}

export default Thumbnail;
