"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useFolder } from "@/app/file-space/context/context";

interface StorageData {
  type: string;
  size: number;
  percentage: number;
  color: string;
  icon: string;
}

const storageInfo: StorageData[] = [
  {
    type: "Documents",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 0%)",
    icon: "📄",
  },
  {
    type: "Images",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 40%)",
    icon: "🖼️",
  },
  {
    type: "Videos",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 60%)",
    icon: "🎥",
  },
  {
    type: "Audio",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 73%)",
    icon: "🎵",
  },
  {
    type: "Archives",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 80%)",
    icon: "📦",
  },
  {
    type: "Other",
    size: 0,
    percentage: 0,
    color: "hsl(0, 0%, 87%)",
    icon: "📁",
  },
];

export function StorageOverview() {
  const [Quota, setQuota] = useState<any | null>(null);
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const folder = useFolder();
  const GB = 1024 ** 3;

  useEffect(() => {
    navigator.storage.estimate().then(({ quota, usage }: any) => {
      const q = {
        total: (quota / GB).toFixed(2),
        used: (usage / GB).toFixed(2),
        free: ((quota - usage) / GB).toFixed(2),
      };
      setQuota(q);
      evaluator(q);
    });
  }, []);

  const evaluator = (Quota: any) => {
    if (!folder) return;

    const Image = [".png", ".jpg", ".jpeg"];
    const Video = [".mp4", ".mkv"];
    const Docs = [".docx", ".pdf"];
    const Audio = [".mp3", ".wav"];
    const { fileMap } = folder;

    const newData: StorageData[] = [...storageInfo];

    fileMap.values().forEach((f) => {
      const name = f.name.toLowerCase();
      const sizeGB = f.size / GB;

      if (Image.some((ext) => name.endsWith(ext))) {
        newData[1].size += sizeGB;
      } else if (Video.some((ext) => name.endsWith(ext))) {
        newData[2].size += sizeGB;
      } else if (Docs.some((ext) => name.endsWith(ext))) {
        newData[0].size += sizeGB;
      } else if (Audio.some((ext) => name.endsWith(ext))) {
        newData[3].size += sizeGB;
      } else {
        newData[5].size += sizeGB;
      }
    });

    newData.forEach((item) => {
      item.percentage = parseFloat(
        ((item.size / Quota.total) * 100).toFixed(2)
      );
    });

    setStorageData([...newData]);
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle>
            <p className="scroll-m-20 text-[20px] font-no tracking-tight geist ">
              Storage & Usage
            </p>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-black h-auto p-0 font-normal"
          >
            Manage
          </Button>
        </div>
      </CardHeader>

      <>
        <CardContent className="p-6 space-y-6">
          {/* Main Storage Overview */}
          {Quota && (
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {Quota.used} GB
                  </p>
                  <p className="text-sm text-gray-500">
                    of {Quota.total} GB used
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {((Quota.used / Quota.total) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500">Used</p>
                </div>
              </div>

              <div className="space-y-2">
                <Progress
                  value={parseFloat(
                    ((Quota.used / Quota.total) * 100).toFixed(2)
                  )}
                  className="h-2 bg-gray-100"
                />
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>0 GB</span>
                  <span>{Quota.total} GB</span>
                </div>
              </div>
            </div>
          )}

          {/* Storage Breakdown */}
          {storageData && (
            <div className="space-y-3">
              {storageData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size.toFixed(2)} GB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs bg-gray-100 text-gray-600 hover:bg-gray-100"
                    >
                      {item.percentage}%
                    </Badge>
                    <div className="w-16">
                      <Progress
                        value={item.percentage}
                        className="h-1.5 bg-gray-100"
                        style={
                          {
                            "--progress-foreground": item.color,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Storage */}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100 rounded-b-xl p-4">
          <div className="flex items-center w-full justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Available Space
              </p>
              {Quota && (
                <p className="text-xs text-gray-500 font-mono">
                  {Quota.free} GB remaining
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 h-7 px-3 text-xs"
            >
              Upgrade
            </Button>
          </div>
        </CardFooter>
      </>
    </Card>
  );
}
