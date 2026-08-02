"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  show: boolean;
  onDone?: () => void;
}

interface Piece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  emoji: string;
}

const COLORS = ["#58CC02", "#FFC800", "#1CB0F6", "#CE82FF", "#FF9600", "#FF4B4B"];
const EMOJIS = ["💎", "⭐", "✨", "🎉", "🎊", "💰", "📈"];

export function Confetti({ show, onDone }: ConfettiProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!show) return;
    const newPieces: Piece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 1.5,
      rotate: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    }));
    setPieces(newPieces);
    const t = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, 3000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              className="absolute text-2xl"
              style={{ left: `${p.x}%`, top: "-5%" }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{ y: "110vh", rotate: p.rotate, opacity: 0 }}
              transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
