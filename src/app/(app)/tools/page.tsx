"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils/cn";
import { Calculator, TrendingUp, Home, Flame, FileText, ChevronLeft, Info } from "lucide-react";

type TabId = "compound" | "mortgage" | "fire" | "tax";

const tabs: { id: TabId; label: string; emoji: string; icon: typeof Calculator }[] = [
  { id: "compound", label: "Lãi kép",      emoji: "📈", icon: TrendingUp },
  { id: "mortgage", label: "Vay mua nhà",  emoji: "🏠", icon: Home },
  { id: "fire",     label: "FIRE",         emoji: "🔥", icon: Flame },
  { id: "tax",      label: "Thuế TNCN",    emoji: "📋", icon: FileText },
];

export default function ToolsPage() {
  const [tab, setTab] = useState<TabId>("compound");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-duo-lg border-2 border-duolingo-blue-dark bg-duolingo-blue p-4 text-white shadow-duo-blue-sm">
        <h1 className="font-display text-2xl font-extrabold flex items-center gap-2">
          <Calculator size={26} /> Công cụ tài chính
        </h1>
        <p className="mt-1 text-sm opacity-90">Tính nhanh các kịch bản tài chính cho người Việt</p>
      </div>

      {/* Tab nav */}
      <div className="grid grid-cols-4 gap-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 border-b-4 px-1 py-2 text-xs font-bold transition-all",
                active
                  ? "border-duolingo-green-dark bg-duolingo-green text-white shadow-duo-green-sm"
                  : "border-duolingo-gray-1 bg-white text-duolingo-gray-4"
              )}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "compound" && <CompoundCalculator />}
          {tab === "mortgage" && <MortgageCalculator />}
          {tab === "fire" && <FireCalculator />}
          {tab === "tax" && <TaxCalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// COMPOUND INTEREST CALCULATOR
// ============================================================
function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100_000_000); // 100 triệu
  const [monthly, setMonthly] = useState(5_000_000);
  const [rate, setRate] = useState(10); // %/năm
  const [years, setYears] = useState(10);

  const result = (() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const fvPrincipal = principal * Math.pow(1 + r, n);
    const fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const total = fvPrincipal + fvMonthly;
    const contributed = principal + monthly * n;
    const interest = total - contributed;
    return { total, contributed, interest, fvPrincipal, fvMonthly };
  })();

  return (
    <div className="space-y-3">
      <div className="duo-card">
        <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5 flex items-center gap-2">
          📈 Lãi kép (Compound Interest)
        </h2>
        <p className="mt-1 text-xs text-duolingo-gray-3">Sức mạnh của lãi mẹ đẻ lãi con theo thời gian</p>
      </div>

      <div className="duo-card space-y-3">
        <Input label="💰 Số tiền ban đầu" value={principal} onChange={setPrincipal} step={1_000_000} suffix="đ" />
        <Input label="💵 Đóng góp hàng tháng" value={monthly} onChange={setMonthly} step={500_000} suffix="đ" />
        <Input label="📊 Lãi suất năm" value={rate} onChange={setRate} step={0.5} suffix="%" min={0} max={50} />
        <Input label="⏱️ Số năm" value={years} onChange={setYears} step={1} suffix="năm" min={1} max={50} />
      </div>

      <ResultCard
        highlight={`${formatNumber(result.total)} đ`}
        label="Giá trị tương lai"
        breakdown={[
          { label: "💰 Tổng đóng góp", value: result.contributed, color: "duolingo-blue" },
          { label: "📈 Lãi kiếm được", value: result.interest, color: "duolingo-green" },
        ]}
      />

      <div className="rounded-duo border-2 border-duolingo-gold-dark bg-duolingo-gold/10 p-3 text-xs text-duolingo-gray-4">
        <div className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-duolingo-gold-dark" />
          <div>
            <b>Quy tắc 72:</b> với lãi {rate}%/năm, tiền của bạn sẽ GẤP ĐÔI sau khoảng <b>{(72 / rate).toFixed(1)} năm</b>.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MORTGAGE CALCULATOR
// ============================================================
function MortgageCalculator() {
  const [price, setPrice] = useState(2_000_000_000); // 2 tỷ
  const [downPct, setDownPct] = useState(30);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const result = (() => {
    const down = price * (downPct / 100);
    const loan = price - down;
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly = loan > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
    const totalPay = monthly * n;
    const totalInterest = totalPay - loan;
    return { down, loan, monthly, totalPay, totalInterest };
  })();

  return (
    <div className="space-y-3">
      <div className="duo-card">
        <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5 flex items-center gap-2">
          🏠 Tính vay mua nhà
        </h2>
        <p className="mt-1 text-xs text-duolingo-gray-3">Ước tính khoản vay và tiền trả hàng tháng</p>
      </div>

      <div className="duo-card space-y-3">
        <Input label="🏠 Giá căn nhà" value={price} onChange={setPrice} step={100_000_000} suffix="đ" />
        <Input label="💵 Trả trước (%)" value={downPct} onChange={setDownPct} step={5} suffix="%" min={10} max={90} />
        <Input label="📋 Thời hạn vay" value={years} onChange={setYears} step={1} suffix="năm" min={5} max={30} />
        <Input label="📊 Lãi suất (%/năm)" value={rate} onChange={setRate} step={0.1} suffix="%" min={1} max={20} />
      </div>

      <ResultCard
        highlight={`${formatNumber(result.monthly)} đ/tháng`}
        label="Trả hàng tháng"
        breakdown={[
          { label: "💰 Trả trước", value: result.down, color: "duolingo-blue" },
          { label: "📋 Tổng vay", value: result.loan, color: "duolingo-orange" },
          { label: "📈 Tổng lãi", value: result.totalInterest, color: "duolingo-red" },
        ]}
      />

      <div className="rounded-duo border-2 border-duolingo-blue-dark bg-duolingo-blue/10 p-3 text-xs text-duolingo-gray-4">
        <div className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-duolingo-blue" />
          <div>
            Quy tắc an toàn: tiền trả nhà/tháng không nên quá <b>30% thu nhập</b> ròng của gia đình.
            Vay dài = trả ít/tháng nhưng tổng lãi cao hơn.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FIRE CALCULATOR
// ============================================================
function FireCalculator() {
  const [expenses, setExpenses] = useState(15_000_000); // 15tr/tháng
  const [current, setCurrent] = useState(500_000_000); // 500tr
  const [monthlySave, setMonthlySave] = useState(10_000_000);
  const [rate, setRate] = useState(8);

  const result = (() => {
    const annualExp = expenses * 12;
    const fireNumber = annualExp * 25; // 25x rule
    const r = rate / 100 / 12;
    const remaining = Math.max(0, fireNumber - current);
    // months to reach FIRE
    let months: number;
    if (monthlySave <= 0 || r === 0) {
      months = monthlySave > 0 ? remaining / monthlySave : Infinity;
    } else {
      // n = ln(1 + remaining*r/monthlySave) / ln(1+r)
      const x = remaining * r / monthlySave;
      months = x > 0 ? Math.log(1 + x) / Math.log(1 + r) : 0;
    }
    const years = months / 12;
    return { fireNumber, remaining, years, months };
  })();

  return (
    <div className="space-y-3">
      <div className="duo-card">
        <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5 flex items-center gap-2">
          🔥 FIRE — Tự do tài chính
        </h2>
        <p className="mt-1 text-xs text-duolingo-gray-3">Bao giờ bạn đủ tiền để nghỉ hưu?</p>
      </div>

      <div className="duo-card space-y-3">
        <Input label="💸 Chi tiêu/tháng hiện tại" value={expenses} onChange={setExpenses} step={1_000_000} suffix="đ" />
        <Input label="💰 Tiền đã có" value={current} onChange={setCurrent} step={50_000_000} suffix="đ" />
        <Input label="💵 Tiết kiệm/tháng" value={monthlySave} onChange={setMonthlySave} step={1_000_000} suffix="đ" />
        <Input label="📊 Lãi suất danh nghĩa" value={rate} onChange={setRate} step={0.5} suffix="%" min={0} max={20} />
      </div>

      <ResultCard
        highlight={result.years === Infinity || isNaN(result.years) ? "∞" : `${result.years.toFixed(1)} năm`}
        label="Thời gian để đạt FIRE"
        breakdown={[
          { label: "🎯 Số tiền cần", value: result.fireNumber, color: "duolingo-gold" },
          { label: "📊 Còn thiếu", value: result.remaining, color: "duolingo-red" },
        ]}
      />

      <div className="rounded-duo border-2 border-duolingo-orange-dark bg-duolingo-orange/10 p-3 text-xs text-duolingo-gray-4">
        <div className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-duolingo-orange" />
          <div>
            <b>Quy tắc 25×:</b> cần tích lũy <b>25 lần chi phí năm</b> thì có thể rút 4%/năm và nghỉ hưu.
            Tăng tiết kiệm hoặc giảm chi tiêu = FIRE sớm hơn.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAX CALCULATOR (Thuế TNCN)
// ============================================================
function TaxCalculator() {
  const [grossMonthly, setGrossMonthly] = useState(25_000_000); // 25tr/tháng
  const [dependents, setDependents] = useState(0);
  const [insurance, setInsurance] = useState(8); // % BHXH+BHYT+BHTN NLĐ

  const result = (() => {
    const deduction = 11_000_000; // giảm trừ bản thân
    const dependentDeduction = dependents * 4_400_000; // mỗi người phụ thuộc
    const insAmount = grossMonthly * (insurance / 100);
    const taxable = Math.max(0, grossMonthly - insAmount - deduction - dependentDeduction);

    // Lũy tiến 7 bậc (áp dụng cho phần thu nhập tháng)
    const brackets = [
      { upTo: 5_000_000,    rate: 0.05 },
      { upTo: 10_000_000,   rate: 0.10 },
      { upTo: 18_000_000,   rate: 0.15 },
      { upTo: 32_000_000,   rate: 0.20 },
      { upTo: 52_000_000,   rate: 0.25 },
      { upTo: 80_000_000,   rate: 0.30 },
      { upTo: Infinity,     rate: 0.35 },
    ];

    let tax = 0;
    let remaining = taxable;
    let prevCap = 0;
    const breakdown: { range: string; amount: number; tax: number }[] = [];
    for (const b of brackets) {
      if (remaining <= 0) break;
      const cap = b.upTo - prevCap;
      const taxableInBracket = Math.min(remaining, cap);
      const taxInBracket = taxableInBracket * b.rate;
      if (taxableInBracket > 0) {
        breakdown.push({
          range: `${formatNumber(prevCap + 1)} - ${b.upTo === Infinity ? "∞" : formatNumber(b.upTo)}`,
          amount: taxableInBracket,
          tax: taxInBracket,
        });
      }
      tax += taxInBracket;
      remaining -= taxableInBracket;
      prevCap = b.upTo;
    }

    const net = grossMonthly - insAmount - tax;

    return { insAmount, taxable, tax, net, breakdown };
  })();

  return (
    <div className="space-y-3">
      <div className="duo-card">
        <h2 className="font-display text-lg font-extrabold text-duolingo-gray-5 flex items-center gap-2">
          📋 Thuế TNCN (lũy tiến 7 bậc)
        </h2>
        <p className="mt-1 text-xs text-duolingo-gray-3">Tính thuế thu nhập cá nhân phải đóng hàng tháng</p>
      </div>

      <div className="duo-card space-y-3">
        <Input label="💰 Thu nhập gross" value={grossMonthly} onChange={setGrossMonthly} step={1_000_000} suffix="đ" />
        <Input label="👨‍👩‍👧 Người phụ thuộc" value={dependents} onChange={setDependents} step={1} suffix="người" min={0} max={10} />
        <Input label="🏥 BHXH+BHYT+BHTN (%)" value={insurance} onChange={setInsurance} step={0.5} suffix="%" min={0} max={20} />
      </div>

      <ResultCard
        highlight={`${formatNumber(result.tax)} đ`}
        label="Thuế TNCN/tháng"
        breakdown={[
          { label: "💰 Lương gross", value: grossMonthly, color: "duolingo-gray-4" },
          { label: "🏥 BHXH+BHYT+BHTN", value: result.insAmount, color: "duolingo-orange" },
          { label: "💵 Thực nhận", value: result.net, color: "duolingo-green" },
        ]}
      />

      {result.breakdown.length > 0 && (
        <div className="duo-card">
          <h3 className="text-sm font-extrabold text-duolingo-gray-5 mb-2">📊 Chi tiết các bậc thuế</h3>
          <div className="space-y-1 text-xs">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-duolingo-gray-3">{b.range}</span>
                <span className="font-bold text-duolingo-gray-5">{formatNumber(b.tax)} đ</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-duo border-2 border-duolingo-purple-dark bg-duolingo-purple/10 p-3 text-xs text-duolingo-gray-4">
        <div className="flex items-start gap-2">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-duolingo-purple" />
          <div>
            <b>Mẹo:</b> đóng BHXH đầy đủ để được giảm trừ + hưởng lương hưu. Đăng ký người phụ thuộc (con, bố mẹ) để giảm thuế.
            Mức giảm trừ gia cảnh theo Luật Thuế TNCN 2024.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helper components
// ============================================================
function Input({ label, value, onChange, step, suffix, min, max }: { label: string; value: number; onChange: (v: number) => void; step?: number; suffix?: string; min?: number; max?: number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-duolingo-gray-4">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="w-full rounded-xl border-2 border-duolingo-gray-1 bg-white px-3 py-2 text-base font-bold text-duolingo-gray-5 outline-none focus:border-duolingo-green"
        />
        {suffix && <span className="text-sm font-bold text-duolingo-gray-3 w-12">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultCard({ highlight, label, breakdown }: { highlight: string; label: string; breakdown: { label: string; value: number; color: string }[] }) {
  return (
    <div className="rounded-duo-lg border-2 border-duolingo-gold-dark bg-duolingo-gold/15 p-4 shadow-duo-card">
      <div className="text-xs font-bold uppercase text-duolingo-gold-dark">{label}</div>
      <div className="mt-1 font-display text-3xl font-extrabold text-duolingo-gray-5">
        {highlight}
      </div>
      {breakdown.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t-2 border-duolingo-gold-dark/20 pt-3">
          {breakdown.map((b, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-duolingo-gray-3">{b.label}</span>
              <span className={cn("font-bold", `text-${b.color}`)}>{formatNumber(b.value)} đ</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
