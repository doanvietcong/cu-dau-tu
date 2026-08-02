"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/userStore";
import { LESSONS } from "@/data/curriculum";
import { QuestionCard } from "@/components/lesson/QuestionCard";
import { CuDauTu } from "@/components/mascot/CuDauTu";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Repeat, Trophy, BookOpen } from "lucide-react";

type Phase = "intro" | "playing" | "done";

export default function ReviewPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  // Build flat list of weak questions with their lesson context
  const weakQuestions = useMemo(() => {
    if (!user) return [];
    return user.weakQuestionIds
      .map((qid) => {
        for (const lesson of LESSONS) {
          const q = lesson.questions.find((x) => x.id === qid);
          if (q) return { question: q, lessonId: lesson.id, lessonTitle: lesson.title };
        }
        return null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [user]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [qIdx, setQIdx] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts ?? 5);
  const [correctCount, setCorrectCount] = useState(0);
  const [resolved, setResolved] = useState<string[]>([]);

  useEffect(() => {
    if (user) setHearts(user.hearts);
  }, [user]);

  if (!user) return null;

  if (weakQuestions.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CuDauTu size={120} mood="happy" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-duolingo-gray-5">
          Chưa có câu sai nào!
        </h1>
        <p className="mt-2 text-sm text-duolingo-gray-3 max-w-xs">
          Hoàn thành bài học đầu tiên và sai vài câu, mình sẽ thu thập lại ở đây để bạn ôn tập.
        </p>
        <Link href="/learn" className="mt-4">
          <Button>BẮT ĐẦU HỌC →</Button>
        </Link>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-bold text-duolingo-gray-3 hover:text-duolingo-gray-5">
          <ArrowLeft size={16} /> Quay lại
        </Link>

        <div className="rounded-duo-lg border-2 border-duolingo-red-dark bg-gradient-to-br from-duolingo-red/15 to-duolingo-orange/10 p-5 text-center">
          <CuDauTu size={120} mood="thinking" />
          <h1 className="mt-3 font-display text-2xl font-extrabold text-duolingo-gray-5">
            Ôn tập câu sai
          </h1>
          <p className="mt-2 text-sm text-duolingo-gray-3">
            Cùng Cú Đầu Tư luyện lại <b className="text-duolingo-red">{weakQuestions.length} câu</b> bạn đã từng sai.
            <br />
            Trả lời đúng sẽ được xoá khỏi danh sách.
          </p>

          <div className="mt-4 rounded-xl bg-white p-3 text-left">
            <div className="text-xs font-bold uppercase text-duolingo-gray-3">Phân bố theo bài học</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(
                weakQuestions.reduce((acc, q) => {
                  acc[q.lessonTitle] = (acc[q.lessonTitle] ?? 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([title, count]) => (
                <span key={title} className="rounded-full bg-duolingo-gray-1 px-2 py-0.5 text-xs text-duolingo-gray-4">
                  {title}: {count}
                </span>
              ))}
            </div>
          </div>

          <Button onClick={() => setPhase("playing")} size="lg" className="mt-5">
            <Repeat size={18} /> BẮT ĐẦU ÔN TẬP
          </Button>
        </div>
      </motion.div>
    );
  }

  if (phase === "done") {
    const total = weakQuestions.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CuDauTu size={140} mood={pct >= 80 ? "celebrating" : "happy"} />
        <h1 className="mt-3 font-display text-3xl font-extrabold text-duolingo-gray-5">
          {pct === 100 ? "Hoàn hảo!" : pct >= 70 ? "Tốt lắm!" : "Cố lên!"}
        </h1>
        <p className="mt-1 text-duolingo-gray-3">
          Bạn đã trả lời đúng <b className="text-duolingo-green">{correctCount}/{total}</b> câu ({pct}%)
        </p>
        <div className="mt-4 w-full max-w-sm">
          <div className="h-3 overflow-hidden rounded-full bg-duolingo-gray-1">
            <motion.div
              className="h-full bg-duolingo-green"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <Button onClick={() => router.push("/learn")} fullWidth>
            <Trophy size={18} /> VỀ LỘ TRÌNH
          </Button>
          <Button variant="secondary" onClick={() => {
            setPhase("intro");
            setQIdx(0);
            setCorrectCount(0);
            setResolved([]);
          }} fullWidth>
            <Repeat size={18} /> ÔN LẠI
          </Button>
        </div>
      </motion.div>
    );
  }

  // Playing phase
  const current = weakQuestions[qIdx];
  const isLast = qIdx === weakQuestions.length - 1;

  const handleAnswer = (correct: boolean, userAnswer: string) => {
    if (correct) {
      setCorrectCount((c) => c + 1);
      setResolved((r) => [...r, current.question.id]);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const handleContinue = () => {
    if (isLast) {
      // Mark all resolved as fixed
      const updateUser = useUserStore.getState();
      const newWeak = updateUser.user?.weakQuestionIds.filter((id) => !resolved.includes(id)) ?? [];
      updateUser._setWeakQuestions?.(newWeak);
      setPhase("done");
    } else {
      setQIdx((i) => i + 1);
    }
  };

  return (
    <div className="px-2">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/learn" className="text-duolingo-gray-3 hover:text-duolingo-gray-5">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="h-4 overflow-hidden rounded-full bg-duolingo-gray-1">
            <motion.div
              className="h-full bg-duolingo-red"
              initial={{ width: 0 }}
              animate={{ width: `${((qIdx + 1) / weakQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="text-xs font-bold text-duolingo-gray-3">
          {qIdx + 1}/{weakQuestions.length}
        </div>
      </div>

      <div className="mb-3 rounded-xl bg-duolingo-red/10 p-2 text-center text-xs text-duolingo-red-dark">
        <BookOpen size={12} className="inline" /> Ôn tập: <b>{current.lessonTitle}</b>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.question.id}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <QuestionCard
            question={current.question}
            questionNumber={qIdx + 1}
            totalQuestions={weakQuestions.length}
            hearts={hearts}
            onAnswer={handleAnswer}
            onContinue={handleContinue}
            onExit={() => router.push("/learn")}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
