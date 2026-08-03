"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const TIPS = [
  // === NỀN TẢNG (giữ cũ) ===
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

  // === MỚI: BẢO HIỂM (Unit 13) ===
  "💡 BH ung thư phí 1-3 triệu/năm (30 tuổi) chi trả 200-500 triệu khi mắc bệnh. Đáng mua từ 30 tuổi.",
  "💡 BH xe máy bắt buộc NĐ 03/2023: 50-100k/năm, bồi thường 150 triệu/vụ. Không có = phạt 200-300k + tước GPLX.",
  "💡 BH sức khỏe nên chọn gói có hạn mức ≥ 1 năm thu nhập. Lương 300 triệu/năm → gói tối thiểu 300 triệu.",
  "💡 PVI Care có 5 gói: Đồng 100M → Bạc 160M → Titan 200M → Vàng 400M → Bạch kim 600M. Chọn theo nhu cầu.",
  "💡 Tầm soát ung thư từ 40 tuổi: X-quang phổi, siêu âm bụng, xét nghiệm máu, nội soi. 2-5 triệu/năm.",
  "💡 Liên kết đơn vị (unit-linked) rủi ro cao hơn liên kết chung. Từ 1/7/2025 chỉ BH tử vong + thương tật toàn bộ vĩnh viễn.",

  // === MỚI: BẪY TÀI CHÍNH (Unit 14) ===
  "💡 App vay '5%/ngày' = 1,825%/năm. Gấp 100x lãi ngân hàng. Đây là cho vay nặng lãi theo Bộ luật Hình sự.",
  "💡 Forex 70-95% trader thua lỗ. Binary Options (IQ Option, Binomo) hoạt động chui ở VN.",
  "💡 Group Zalo 'cô Nga' thu 5tr/tháng + hứa lãi 30%/tháng = lừa đảo. Ai giỏi vậy đi dạy thu 5tr?",
  "💡 Check app vay trên website NHNN (sbv.gov.vn) trước khi vay. Không có tên = cho vay nặng lãi.",
  "💡 MMM, Air Blade, iFan... đều Ponzi. Lãi 30%/tháng KHÔNG có cơ hội thực nào tồn tại bền vững.",

  // === MỚI: ĐẦU TƯ THỰC CHIẾN (Unit 15) ===
  "💡 Khi 5/5 CTCK cùng 'Mua' 1 cổ phiếu = consensus = KHÔNG có edge. Tìm mã bị đánh giá thấp mới có cơ hội.",
  "💡 P/E = 32x (MWG 2024) gấp 2-2.5x ngành = đắt. Trả 32 năm lợi nhuận để sở hữu - chỉ hợp lý khi tăng trưởng EPS > 30%.",
  "💡 Cổ đông lớn bán liên tục = cảnh báo mạnh. Người trong cuộc biết công ty rõ hơn analyst.",
  "💡 HPG (Hòa Phát) là cổ phiếu chu kỳ thép. P/E 8-10x, phụ thuộc giá HRC TQ. Cần theo dõi giá thép.",
  "💡 VinFast lỗ lũy kế 8-10 tỷ USD. VIC đang bơm vốn liên tục. Coi chừng pha loãng cổ đông hiện hữu.",
  "💡 Margin 2x = lãi gấp đôi nhưng lỗ cũng gấp đôi. Cổ phiếu giảm 50% = mất hết vốn, bị force-sell.",

  // === MỚI: TÀI CHÍNH GIA ĐÌNH (Unit 16) ===
  "💡 Trước khi cưới, vợ chồng PHẢI nói thẳng về tiền: nợ, thu nhập, mục tiêu, thoả thuận tài khoản chung/riêng.",
  "💡 Ly hôn: người nội trợ VẪN được chia tài sản chung (Điều 59 Luật HN&GĐ 2014). Không phải 50-50 nhưng được bảo vệ.",
  "💡 Cấp dưỡng nuôi con: 15-30% thu nhập bên không trực tiếp nuôi. 2 con: 20-35%. 3 con trở lên: 25-40%.",
  "💡 Di chúc viết tay cần: viết tay toàn bộ + ký tên + ghi ngày tháng. Thiếu 1 trong 3 = vô hiệu.",
  "💡 Phần thừa kế bắt buộc = 2/3 tài sản cho con dưới 18, cha mẹ, vợ/chồng. Bạn không thể cho đi hết.",
  "💡 Bố mẹ > 60 tuổi không thu nhập = người phụ thuộc → giảm trừ 4.4 triệu/tháng/người khỏi thuế TNCN.",
  "💡 Quỹ khẩn cấp gia đình 6-12 tháng chi phí. 2 thu nhập: 6 tháng. 1 thu nhập: 9-12 tháng.",
  "💡 Nuôi con 0-18 tuổi tại VN: 800 triệu - 1.5 tỷ. Trường quốc tế/du học: 3-5 tỷ. Lập quỹ giáo dục sớm.",

  // === MỚI: CHI TIÊU THỰC CHIẾN (Unit 17) ===
  "💡 Trà sữa 50k/ngày × 30 năm × lãi 7% = hơn 2 tỷ. Cắt 1 ly/ngày = mua được căn hộ nhỏ.",
  "💡 Grab 2.5tr/tháng × 30 năm × lãi 7% = hơn 2.5 tỷ. Metro + xe máy tiết kiệm hơn nhiều.",
  "💡 Quy tắc 24-72h cooling-off: mua đồ > 500k, chờ 1-3 ngày. Nếu quên = tiết kiệm. Áp dụng cho cả flash sale.",
  "💡 Tiền thuê nhà không quá 30% thu nhập. Lương 15tr → thuê tối đa 4.5tr. Quá 50% = khủng hoảng khi mất việc.",
  "💡 GrabFood gấp 2-3x nấu ở nhà. Cơm nấu nhà 25-35k vs GrabFood 60-100k/bữa. 1 tháng tiết kiệm 3-5 triệu.",
  "💡 Chi phí đi lại không quá 15% thu nhập. Lương 15tr → tối đa 2.25tr. Grab 3-4tr = đang vượt ngân sách.",
  "💡 'Decoy pricing': shop treo 1 sản phẩm giá cao để sản phẩm giữa trông 'hời'. Đừng mua vì sale 50% nếu không cần.",

  // === MỚI: FREELANCER/HKD (Unit 18) ===
  "💡 Freelancer < 100 triệu/năm: thuế khoán 1-2% trên doanh thu. Không cần đăng ký HKD nhưng VẪN phải nộp thuế.",
  "💡 Thuế TNCN freelancer (HKD): 10% trên doanh thu. Hạn quyết toán 30/4 năm sau. Trễ = phạt + lãi 0.03%/ngày.",
  "💡 BHXH tự nguyện 22% (Luật 41/2024 từ 1/7/2025). Mức 5tr/tháng → đóng 1.1tr. 35 năm = 75% lương hưu.",
  "💡 Quỹ khẩn cấp freelancer 9-12 tháng. Thu nhập dao động → cần lớn hơn nhân viên chính thức.",
  "💡 Hợp đồng freelance PHẢI có: scope, deadline, milestone, deposit (20-50%), IP rights, phạt trễ thanh toán.",
  "💡 Scope creep (KH yêu cầu thêm ngoài hợp đồng) = thông báo KH hoặc tính thêm phí. KHÔNG làm miễn phí.",
  "💡 Nghỉ việc an toàn: cần quỹ 6-12 tháng + kế hoạch rõ ràng. Đừng nghỉ khi quỹ chưa đủ, kẻo phải nhận việc tệ.",
  "💡 'Pay yourself first' cho freelancer: khi có thu nhập lớn, chuyển ngay 20% vào tài khoản 'lương' cố định.",
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
