"use client";

import { StorageOverview } from "./components/storage-overview";
// import { RecentFiles } from "./components/recent-files";

export default function StorageDashboard() {
  return (
    <div className="w-full  bg-gray-50">
      <div
        className="w-full space-y-6"
        style={{ fontFamily: "GeistSans, GeistSans Fallback" }}
      >
        <StorageOverview />
        {/* <RecentFiles /> */}
      </div>
    </div>
  );
}
