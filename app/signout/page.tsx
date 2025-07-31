"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => {
        signOut();
        document.cookie = "onboarded=false; path=/";
      }}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Sign out
    </button>
  );
}
