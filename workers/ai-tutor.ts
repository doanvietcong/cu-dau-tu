/**
 * Cloudflare Worker — AI Tutor proxy
 *
 * Deploy bằng `wrangler deploy` để có 1 endpoint API
 * an toàn gọi OpenAI/Anthropic mà không lộ API key.
 *
 * Setup:
 *   1. cd workers
 *   2. npm install
 *   3. wrangler secret put OPENAI_API_KEY (hoặc ANTHROPIC_API_KEY)
 *   4. wrangler deploy
 *   5. Copy URL → cập nhật AI_TUTOR_ENDPOINT trong frontend
 */

interface Env {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  ALLOWED_ORIGIN: string; // e.g. "https://cu-dau-tu.pages.dev"
}

const SYSTEM_PROMPT = `Bạn là "Cú Đầu Tư" — trợ lý tài chính cá nhân thân thiện cho người Việt Nam.

Phong cách:
- Trả lời bằng tiếng Việt, dùng VND, ngân hàng VN (Vietcombank, Techcombank, MB Bank...)
- Tham chiếu sản phẩm tài chính VN: HOSE, quỹ mở VCBF/VinaCapital, BHXH, TPCP, CIC, UBCKNN
- Ngắn gọn, dễ hiểu, dùng bullet points và bold
- Thực tế, có ví dụ số cụ thể (VD: 100 triệu, 5%/năm, 20 năm)
- Khi không chắc, nói rõ và khuyên tham khảo chuyên gia

Kiến thức nền:
- Lãi kép, quy tắc 72
- Quy tắc 50/30/20 cho ngân sách
- Nợ tốt vs nợ xấu, lãi thẻ tín dụng
- DCA, phân bổ tài sản, cổ phiếu/quỹ mở/trái phiếu
- Thuế TNCN 7 bậc lũy tiến ở VN
- FIRE, quy tắc 25×, quy tắc 4%
- BHXH, BHYT, BHTN tại VN
- Thuế, bảo hiểm, đầu tư BĐS Việt Nam

Không bao giờ:
- Khuyên mua cổ phiếu cụ thể (chỉ giải thích khái niệm)
- Cam kết lợi nhuận
- Thay thế tư vấn tài chính chuyên nghiệp`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(env.ALLOWED_ORIGIN),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { messages } = (await request.json()) as { messages: { role: string; content: string }[] };

      // Try OpenAI first
      if (env.OPENAI_API_KEY) {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content ?? "Xin lỗi, em chưa trả lời được câu này.";
        return jsonResponse({ reply }, env.ALLOWED_ORIGIN);
      }

      // Fallback: Anthropic
      if (env.ANTHROPIC_API_KEY) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            system: SYSTEM_PROMPT,
            messages,
            max_tokens: 800,
          }),
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text ?? "Xin lỗi, em chưa trả lời được câu này.";
        return jsonResponse({ reply }, env.ALLOWED_ORIGIN);
      }

      return new Response("No AI provider configured", { status: 500 });
    } catch (err) {
      return jsonResponse({ error: String(err) }, env.ALLOWED_ORIGIN, 500);
    }
  },
};

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body: unknown, origin: string, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
