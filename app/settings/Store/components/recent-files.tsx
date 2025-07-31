"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

const recentFiles = [
  {
    name: "project-proposal.pdf",
    size: "2.4 MB",
    modified: "2h",
    type: "PDF",
    icon: "📄",
  },
  {
    name: "design-assets.zip",
    size: "45.2 MB",
    modified: "5h",
    type: "ZIP",
    icon: "📦",
  },
  {
    name: "meeting-recording.mp4",
    size: "128.5 MB",
    modified: "1d",
    type: "MP4",
    icon: "🎥",
  },
  {
    name: "budget-2024.xlsx",
    size: "1.2 MB",
    modified: "2d",
    type: "XLSX",
    icon: "📊",
  },
  {
    name: "presentation.pptx",
    size: "8.7 MB",
    modified: "3d",
    type: "PPTX",
    icon: "📊",
  },
  {
    name: "team-photo.jpg",
    size: "3.2 MB",
    modified: "1w",
    type: "JPG",
    icon: "🖼️",
  },
];

export function RecentFiles() {
  return (
    <Card className="border-gray-200">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Recent Files
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-black h-auto p-0 font-normal"
          >
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {recentFiles.map((file, index) => (
            <div
              key={index}
              className="px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-sm">{file.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate font-mono">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="font-mono">{file.size}</span>
                      <span>•</span>
                      <span>{file.modified}</span>
                      <span>•</span>
                      <Badge
                        variant="secondary"
                        className="text-xs h-4 px-1.5 bg-gray-100 text-gray-600 hover:bg-gray-100"
                      >
                        {file.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 h-auto p-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
