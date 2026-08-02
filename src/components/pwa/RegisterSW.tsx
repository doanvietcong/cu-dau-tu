"use client";

import { useEffect } from "react";

/**
 * Register service worker for offline support.
 * No auto install prompt — user can install via browser menu if they want.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore registration errors
      });
    });
  }, []);

  return null;
}
