"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

export function RegisterSW() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // ignore registration errors
        });
      });
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 30s of usage
      setTimeout(() => setShowInstall(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showInstall && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-3 right-3 z-40 mx-auto max-w-md rounded-duo-lg border-2 border-duolingo-green-dark bg-white p-3 shadow-duo-green"
        >
          <div className="flex items-start gap-2">
            <div className="text-3xl">🦉</div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-sm font-extrabold text-duolingo-gray-5">Cài app lên điện thoại!</div>
              <div className="mt-0.5 text-xs text-duolingo-gray-3">Học offline, mở nhanh, không cần trình duyệt</div>
            </div>
            <button onClick={() => setShowInstall(false)} className="text-duolingo-gray-3 hover:text-duolingo-gray-5">
              <X size={18} />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setShowInstall(false)}
              className="flex-1 rounded-xl bg-duolingo-gray-1 py-1.5 text-xs font-bold text-duolingo-gray-4"
            >
              Để sau
            </button>
            <button
              onClick={handleInstall}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-duolingo-green py-1.5 text-xs font-bold text-white"
            >
              <Download size={12} /> Cài ngay
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
