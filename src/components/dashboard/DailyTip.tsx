"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const TIPS = [
  "💡 Trả lương cho chính mình TRƯỚC — chuyển 10-20% thu nhập vào tiết kiệm NGAY khi nhận lương, phần còn lại mới chi tiêu.",
  "💡 Quỹ khẩn cấp phải ở nơi AN TOÀN, rút ngay được: tiết kiệm không kỳ hạn. KHÔNG đầu tư cổ phiếu/crypto.",
  "💡 Quy tắc 50/30/20: 50% nhu cầu, 30% mong muốn, 20% tiết kiệm/đầu tư. Bắt đầu 10% cũng được.",
  "💡 Lãi kép = lãi mẹ đẻ lãi con. Thời gian là yếu tố quan trọng nhất. Bắt đầu càng sớm càng lợi.",
  "💡 Nợ xấu CIC sẽ theo bạn 3-5 năm. Trả đủ hạn thẻ tín dụng, không để nợ chuyển kỳ.",
  "💡 DCA (mua đều đặn mỗi tháng) giúp trung bình giá, giảm rủi ro mua đỉnh. Phù hợp người mới.",
  "💡 Trước khi đầu tư, hỏi: 'Nếu mất 50%, mình có hoảng không?'. Nếu có → chưa sẵn sàng.",
  "💡 Quy tắc 72: lãi 8%/năm → tiền gấp đôi sau 9 năm. Lãi 12%/năm → 6 năm. Compound cực mạnh.",
  "💡 Mua cà phê 30k/ngày × 30 = 900k/tháng. 10 năm với lãi 10% = ~180 triệu. Latte factor có thật.",
  "💡 Đừng bỏ hết trứng vào 1 giỏ. Đa dạng hóa 5-10 cổ phiếu ở 3-5 ngành khác nhau.",
  "💡 BHNT mua vì BẢO VỆ gia đình, không phải vì lãi suất. Lãi BHNT thường thấp hơn đầu tư.",
  "💡 Thuế TNCN 7 bậc lũy tiến: 5% → 10% → 15% → 20% → 25% → 30% → 35%. Thu nhập càng cao, thuế suất phần vượt càng cao.",
  "💡 BĐS = đòn bẩy tài chính. Vay 70% mua nhà 3 tỷ → lãi 10% nhà = lãi 33% vốn tự có. Ngược lại cũng đúng.",
  "💡 Trước 30 tuổi, tập trung vào TĂNG THU NHẬP (học, kỹ năng, side hustle) hơn là tiết kiệm từng đồng.",
  "💡 Mục tiêu SMART: Specific (cụ thể), Measurable (đo được), Achievable (khả thi), Relevant (liên quan), Time-bound (có hạn).",
];

function pickTipForDate(): string {
  // Use date as seed so tip is same all day
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return TIPS[seed % TIPS.length];
}

export function DailyTip() {
  const tip = pickTipForDate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-duo-lg border-2 border-duolingo-gold-dark bg-gradient-to-br from-duolingo-gold/20 to-duolingo-orange/10 p-3 shadow-duo-card"
    >
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-duolingo-gold">
          <Lightbulb size={16} className="text-duolingo-gold-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-duolingo-gold-dark">💡 Tip hôm nay</div>
          <p className="mt-0.5 text-sm text-duolingo-gray-5">{tip.replace(/^💡\s*/, "")}</p>
        </div>
      </div>
    </motion.div>
  );
}
