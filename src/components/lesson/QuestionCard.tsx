"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/types";
import { cn, shuffle } from "@/lib/utils/cn";
import { Check, X, ArrowRight, Lightbulb, Volume2 } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  hearts: number;
  onAnswer: (correct: boolean, userAnswer: string) => void;
  onContinue: () => void;
  onExit: () => void;
}

export function QuestionCard({ question, questionNumber, totalQuestions, hearts, onAnswer, onContinue, onExit }: QuestionCardProps) {
  const sfx = useSound();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [booleanAnswer, setBooleanAnswer] = useState<boolean | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffled choices/pairs (re-shuffle on every new question so users can't memorize order)
  const shuffledChoices = useMemo(() => {
    if (question.type !== "multiple-choice" || !question.choices) return [];
    return shuffle(question.choices);
  }, [question.id, question.type, question.choices]);

  const shuffledPairRights = useMemo(() => {
    if (question.type !== "match-pairs" || !question.pairs) return [];
    return shuffle(question.pairs.map((p) => p.right));
  }, [question.id, question.type, question.pairs]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedId(null);
    setBooleanAnswer(null);
    setTextAnswer("");
    setMatches({});
    setSubmitted(false);
    setIsCorrect(false);
  }, [question.id]);

  const checkAnswer = (): boolean => {
    switch (question.type) {
      case "multiple-choice":
        return selectedId === question.correctChoiceId;
      case "true-false":
        return booleanAnswer === question.correctBoolean;
      case "fill-blank": {
        // Compare normalized: lowercase + remove all whitespace + remove diacritics.
        // This way "lam phat" / "lamphat" / "lạm phát" all match "lạm phát".
        const normalize = (s: string) =>
          s
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "");
        const ans = normalize(textAnswer);
        const correct = normalize(question.blankAnswer || "");
        return ans === correct;
      }
      case "match-pairs": {
        if (!question.pairs) return false;
        return question.pairs.every((p) => matches[p.left] === p.right);
      }
    }
  };

  const handleSubmit = () => {
    if (question.type === "multiple-choice" && !selectedId) return;
    if (question.type === "true-false" && booleanAnswer === null) return;
    if (question.type === "fill-blank" && !textAnswer.trim()) return;
    if (question.type === "match-pairs" && Object.keys(matches).length !== (question.pairs?.length ?? 0)) return;

    const correct = checkAnswer();
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) sfx.playCorrect();
    else sfx.playWrong();
    onAnswer(correct, getUserAnswerString());
  };

  const getUserAnswerString = (): string => {
    switch (question.type) {
      case "multiple-choice":
        return selectedId ?? "";
      case "true-false":
        return booleanAnswer ? "true" : "false";
      case "fill-blank":
        return textAnswer;
      case "match-pairs":
        return JSON.stringify(matches);
    }
  };

  const canSubmit = (() => {
    if (submitted) return false;
    switch (question.type) {
      case "multiple-choice": return selectedId !== null;
      case "true-false": return booleanAnswer !== null;
      case "fill-blank": return textAnswer.trim().length > 0;
      case "match-pairs": return Object.keys(matches).length === (question.pairs?.length ?? 0);
    }
  })();

  const correctChoiceText = question.choices?.find((c) => c.id === question.correctChoiceId)?.text;

  return (
    <div className="flex min-h-[500px] flex-col">
      {/* Top: progress + close + hearts */}
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onExit} className="text-duolingo-gray-3 hover:text-duolingo-gray-5" aria-label="Đóng">
          <X size={28} />
        </button>
        <div className="flex-1">
          <div className="h-4 overflow-hidden rounded-full bg-duolingo-gray-1">
            <motion.div
              className="h-full bg-duolingo-green"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 text-heart">
          <span className="text-xl">❤️</span>
          <span className="font-extrabold">{hearts}</span>
        </div>
      </div>

      {/* Question prompt */}
      <div className="flex-1">
        {question.hint && !submitted && (
          <div className="mb-2 flex items-start gap-2 rounded-xl bg-duolingo-blue/10 p-2 text-xs text-duolingo-blue-dark">
            <Lightbulb size={14} className="mt-0.5 flex-shrink-0" />
            <span>{question.hint}</span>
          </div>
        )}

        <h2 className="font-display text-2xl font-extrabold leading-tight text-duolingo-gray-5">
          {question.prompt}
        </h2>

        {/* Choices for multiple-choice */}
        {question.type === "multiple-choice" && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shuffledChoices.map((choice) => {
              const isSelected = selectedId === choice.id;
              const isCorrectChoice = choice.id === question.correctChoiceId;
              const showResult = submitted;
              const bg = showResult
                ? isCorrectChoice
                  ? "bg-duolingo-green/15 border-duolingo-green-dark"
                  : isSelected
                  ? "bg-duolingo-red/15 border-duolingo-red-dark"
                  : "border-duolingo-gray-1"
                : isSelected
                ? "border-duolingo-blue bg-duolingo-blue/5"
                : "border-duolingo-gray-1 hover:border-duolingo-blue";
              return (
                <button
                  key={choice.id}
                  onClick={() => !submitted && setSelectedId(choice.id)}
                  disabled={submitted}
                  className={cn(
                    "flex items-center gap-3 rounded-duo border-2 border-b-4 bg-white p-4 text-left font-bold transition-all",
                    "disabled:cursor-not-allowed",
                    bg
                  )}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 border-duolingo-gray-1 bg-duolingo-snow text-sm font-extrabold text-duolingo-gray-3">
                    {choice.id.toUpperCase()}
                  </span>
                  <span className="flex-1 text-duolingo-gray-5">{choice.text}</span>
                  {showResult && isCorrectChoice && <Check size={20} className="text-duolingo-green-dark" />}
                  {showResult && isSelected && !isCorrectChoice && <X size={20} className="text-duolingo-red-dark" />}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {question.type === "true-false" && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { val: true,  label: "Đúng",  color: "duolingo-green" },
              { val: false, label: "Sai",   color: "duolingo-red" },
            ].map((opt) => {
              const isSelected = booleanAnswer === opt.val;
              const showResult = submitted;
              const isCorrectAnswer = question.correctBoolean === opt.val;
              const bg = showResult
                ? isCorrectAnswer
                  ? "bg-duolingo-green/15 border-duolingo-green-dark"
                  : isSelected
                  ? "bg-duolingo-red/15 border-duolingo-red-dark"
                  : "border-duolingo-gray-1"
                : isSelected
                ? "border-duolingo-blue bg-duolingo-blue/5"
                : "border-duolingo-gray-1 hover:border-duolingo-blue";
              return (
                <button
                  key={String(opt.val)}
                  onClick={() => !submitted && setBooleanAnswer(opt.val)}
                  disabled={submitted}
                  className={cn(
                    "rounded-duo border-2 border-b-4 bg-white p-6 text-center font-display text-xl font-extrabold transition-all disabled:cursor-not-allowed",
                    bg
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in blank */}
        {question.type === "fill-blank" && (
          <div className="mt-6">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={submitted}
              placeholder="Điền đáp án..."
              autoFocus
              className={cn(
                "w-full rounded-duo border-2 border-b-4 bg-white px-4 py-3 text-center font-display text-2xl font-extrabold text-duolingo-gray-5 outline-none transition-colors",
                submitted
                  ? isCorrect
                    ? "border-duolingo-green-dark bg-duolingo-green/10"
                    : "border-duolingo-red-dark bg-duolingo-red/10"
                  : "border-duolingo-gray-1 focus:border-duolingo-blue"
              )}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && handleSubmit()}
            />
            {submitted && !isCorrect && (
              <div className="mt-3 rounded-xl border-2 border-duolingo-gold-dark bg-duolingo-gold/15 p-3 text-center">
                <div className="text-xs font-bold uppercase text-duolingo-gold-dark">Đáp án đúng</div>
                <div className="mt-1 font-display text-xl font-extrabold text-duolingo-gray-5">{question.blankAnswer}</div>
              </div>
            )}
          </div>
        )}

        {/* Match pairs */}
        {question.type === "match-pairs" && question.pairs && (
          <div className="mt-6 space-y-2">
            {question.pairs.map((pair) => {
              const matched = matches[pair.left];
              return (
                <div key={pair.left} className="flex items-center gap-2">
                  <div className="flex-1 truncate rounded-xl border-2 border-duolingo-gray-1 bg-white p-2.5 text-sm font-bold text-duolingo-gray-5">
                    {pair.left}
                  </div>
                  <select
                    value={matched ?? ""}
                    onChange={(e) => setMatches({ ...matches, [pair.left]: e.target.value })}
                    disabled={submitted}
                    className="flex-1 rounded-xl border-2 border-duolingo-gray-1 bg-white p-2.5 text-sm font-bold text-duolingo-gray-5 outline-none focus:border-duolingo-blue"
                  >
                    <option value="">— chọn —</option>
                    {shuffledPairRights.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom: submit / feedback bar */}
      <div className="mt-6">
        {!submitted ? (
          <button
            onClick={() => { sfx.playClick(); handleSubmit(); }}
            disabled={!canSubmit}
            className={cn(
              "w-full rounded-2xl border-b-4 border-duolingo-green-dark bg-duolingo-green py-4 font-display text-lg font-extrabold uppercase tracking-wider text-white transition-all",
              "hover:bg-duolingo-green-light active:translate-y-[2px] active:border-b-0 disabled:bg-duolingo-gray-1 disabled:border-duolingo-gray-2 disabled:text-duolingo-gray-2"
            )}
          >
            KIỂM TRA
          </button>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "rounded-duo border-2 p-4",
              isCorrect ? "border-duolingo-green-dark bg-duolingo-green/10" : "border-duolingo-red-dark bg-duolingo-red/10"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-duolingo-green-dark">
                  <Check size={24} strokeWidth={3} />
                  <span className="font-display text-lg font-extrabold uppercase">Tuyệt vời!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-duolingo-red-dark">
                  <X size={24} strokeWidth={3} />
                  <span className="font-display text-lg font-extrabold uppercase">Đáp án sai</span>
                  {!isCorrect && question.type === "multiple-choice" && correctChoiceText && (
                    <span className="text-sm font-bold text-duolingo-gray-3">→ {correctChoiceText}</span>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-duolingo-gray-4">{question.explanation}</p>
            <button
              onClick={() => { sfx.playClick(); onContinue(); }}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 py-3 font-display text-base font-extrabold uppercase tracking-wider text-white",
                isCorrect
                  ? "border-duolingo-green-dark bg-duolingo-green"
                  : "border-duolingo-red-dark bg-duolingo-red"
              )}
            >
              {isCorrect ? "TIẾP TỤC" : "Đã hiểu"} <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
