"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border-2 border-duolingo-gray-1 font-bold",
        },
      }}
    />
  );
}
