"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CuDauTu } from "@/components/mascot/CuDauTu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const SUGGESTED_QUESTIONS = [
  "Lãi kép là gì?",
  "Nên đầu tư gì với 100 triệu?",
  "Cách thoát khỏi nợ thẻ tín dụng?",
  "Quỹ khẩn cấp bao nhiêu là đủ?",
  "VN-Index là gì? Có nên mua cổ phiếu giờ không?",
  "Mua nhà hay thuê nhà?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "lai kep": "Lãi kép là lãi mẹ đẻ lãi con — bạn nhận lãi trên cả gốc VÀ lãi đã sinh ra. Thời gian là yếu tố quan trọng nhất. Ví dụ 10 triệu với lãi 10%/năm, sau 10 năm = 25.9 triệu, sau 20 năm = 67.3 triệu, sau 30 năm = 174.5 triệu!",
  "dau tu": "Với 100 triệu và là người mới, em khuyên:\n\n1. **30-50%** tiết kiệm có kỳ hạn (an toàn)\n2. **20-30%** quỹ mở cổ phiếu (VCBF, VinaCapital) — DCA mỗi tháng\n3. **10-20%** cổ phiếu blue-chip VN (VCB, FPT, MWG) nếu hiểu biết\n4. **Giữ 5-10%** tiền mặt cho cơ hội\n\nQuan trọng: đừng all-in 1 chỗ, đừng dùng margin/đòn bẩy khi mới bắt đầu.",
  "the tin dung": "Để thoát nợ thẻ tín dụng:\n\n1. **Dừng dùng thẻ** ngay (cất đi)\n2. **Gọi ngân hàng** xin giảm lãi hoặc chuyển đổi sang trả góp 0%\n3. **Liệt kê tất cả nợ**: gốc + lãi + phí phạt\n4. **Áp dụng snowball**: trả khoản nhỏ nhất trước để có động lực\n5. **Cắt subscription, ăn uống ngoài** — chuyển tiền đó trả nợ\n6. **Tăng thu nhập**: OT, freelance, bán đồ không dùng\n\nLãi thẻ tín dụng 25-35%/năm — trả càng sớm càng đỡ đau.",
  "khan cap": "Quỹ khẩn cấp lý tưởng = 3-6 tháng chi phí sinh hoạt. Nếu freelance hoặc thu nhập không ổn định → 6-9 tháng.\n\n**Gửi ở đâu**: tiết kiệm KHÔNG kỳ hạn (rút ngay, lãi thấp nhưng an toàn tuyệt đối). KHÔNG đầu tư cổ phiếu/crypto với tiền quỹ khẩn cấp.\n\n**Bắt đầu thế nào**: đặt mục tiêu nhỏ trước — 1 tháng chi phí trong 3-6 tháng, rồi tăng dần.",
  "vn-index": "VN-Index là chỉ số đo sức khỏe toàn thị trường HOSE (Sàn Tp.HCM). Mua cổ phiếu phụ thuộc vào:\n\n1. **Mục tiêu tài chính** của bạn (ngắn hạn vs dài hạn)\n2. **Khẩu vị rủi ro** (chịu được mất 30-50%?)\n3. **Kiến thức** (đã hiểu P/E, ROE, phân tích cơ bản?)\n\n**Nếu mới bắt đầu**: nên DCA (mua đều đặn hàng tháng) quỹ mở index VN30 trước (FUEVFVN), sau khi hiểu rồi hãy chọn cổ phiếu riêng lẻ. Đừng all-in một lúc, đừng dùng margin.",
  "mua nha": "Mua hay thuê phụ thuộc:\n\n**Mua nhà** hợp lý khi:\n- Bạn ổn định ở 1 nơi >5 năm\n- Trả trước ≥30%, vay ≤7 lần thu nhập năm\n- Trả góp ≤30% thu nhập ròng\n- Không có kế hoạch lớn (du học, kinh doanh)\n\n**Thuê nhà** hợp lý khi:\n- Còn trẻ (<30), chưa ổn định\n- Thu nhập chưa cao, tiền đi đầu tư lợi nhuận > lãi vay\n- Cần linh hoạt di chuyển\n\n**Mẹo**: dùng máy tính 'Vay mua nhà' ở trang Công cụ của Cú để tính trước khi quyết.",
};

function findMockResponse(question: string): string {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
    const k = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (q.includes(k)) return val;
  }
  return "Câu hỏi hay! Hiện tại em đang trong chế độ DEMO với các câu trả lời mẫu có sẵn. Để kích hoạt AI thật, anh cần:\n\n1. Tạo Cloudflare Worker làm proxy (xem file `workers/ai-tutor.ts`)\n2. Cấu hình API key (OpenAI hoặc Anthropic) trong Worker secrets\n3. Deploy worker và update endpoint trong code\n\nEm sẽ gửi hướng dẫn chi tiết khi anh sẵn sàng. Trong lúc chờ, anh có thể thử hỏi: '" + SUGGESTED_QUESTIONS[0] + "', '" + SUGGESTED_QUESTIONS[1] + "', v.v.";
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Chào anh! 👋 Em là Cú Đầu Tư — trợ lý tài chính cá nhân. Hỏi em bất cứ điều gì về tiền bạc, đầu tư, tiết kiệm nhé!",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const reply: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: findMockResponse(text),
      ts: Date.now(),
    };
    setMessages((m) => [...m, reply]);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b-2 border-duolingo-gray-1 bg-white p-3">
        <Link href="/learn" className="text-duolingo-gray-3 hover:text-duolingo-gray-5">
          <ChevronLeft size={20} />
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-duolingo-gold to-duolingo-orange">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <div className="font-display text-base font-extrabold text-duolingo-gray-5">Cú Tư Vấn</div>
          <div className="flex items-center gap-1 text-xs text-duolingo-gray-3">
            <span className="h-2 w-2 rounded-full bg-duolingo-green" />
            Đang hoạt động
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                <CuDauTu size={32} mood="happy" animated={false} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                m.role === "user"
                  ? "bg-duolingo-blue text-white"
                  : "bg-white border-2 border-duolingo-gray-1 text-duolingo-gray-5"
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
              <CuDauTu size={32} mood="thinking" animated={false} />
            </div>
            <div className="rounded-2xl border-2 border-duolingo-gray-1 bg-white px-3 py-2.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-duolingo-gray-2" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-duolingo-gray-2" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-duolingo-gray-2" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested (only if just welcome) */}
      {messages.length <= 1 && (
        <div className="border-t-2 border-duolingo-gray-1 bg-white p-3">
          <div className="text-xs font-bold text-duolingo-gray-3 mb-2">💡 Thử hỏi:</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border-2 border-duolingo-gray-1 bg-white px-3 py-1 text-xs text-duolingo-gray-5 hover:border-duolingo-green hover:bg-duolingo-green/5"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (input.trim() && !loading) send(input); }}
        className="border-t-2 border-duolingo-gray-1 bg-white p-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi Cú về tài chính..."
            disabled={loading}
            className="flex-1 rounded-2xl border-2 border-duolingo-gray-1 bg-duolingo-snow px-4 py-2.5 text-sm outline-none focus:border-duolingo-green"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-duolingo-green text-white disabled:bg-duolingo-gray-1 disabled:text-duolingo-gray-2"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
