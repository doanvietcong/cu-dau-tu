import type { Metadata } from "next";
import LessonPlayer from "./LessonPlayer";
import { LESSONS, UNITS } from "@/data/curriculum";

const SITE_URL = "https://cu-dau-tu.pages.dev";

// Pre-generate static pages for all lessons at build time.
// This makes the app fully static-exportable for Cloudflare Pages.
export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

// Force this route to be static, not dynamic
export const dynamicParams = false;

// Mỗi bài học có title + description riêng → 107 trang index được thay vì
// 107 trang trùng title mặc định (vấn đề SEO nghiêm trọng với site học kiến thức).
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const lesson = LESSONS.find((l) => l.id === params.id);
  if (!lesson) {
    return { title: "Không tìm thấy bài học" };
  }
  const unit = UNITS.find((u) => u.id === lesson.unitId);
  const unitTitle = unit?.title ?? "Tài chính cá nhân";

  const title = `${lesson.title} — ${unitTitle} | Cú Đầu Tư`;
  const description = `${lesson.iconEmoji} ${lesson.description} Bài ${lesson.order} của chủ đề ${unitTitle} trong Cú Đầu Tư — ứng dụng học tài chính cá nhân 100% dành cho người Việt.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/lesson/${lesson.id}/` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/lesson/${lesson.id}/`,
      siteName: "Cú Đầu Tư",
      locale: "vi_VN",
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: lesson.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonPlayer lessonId={params.id} />;
}
