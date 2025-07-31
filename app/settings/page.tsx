"use client";
import { Suspense } from "react";
import SettingsClient from "./";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsClient />
    </Suspense>
  );
}
