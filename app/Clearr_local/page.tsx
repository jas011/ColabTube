"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    localStorage.clear();
    document.cookie = "onboarded='false'; path=/";
  });
  return <div></div>;
}
