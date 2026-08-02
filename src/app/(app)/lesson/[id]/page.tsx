import LessonPlayer from "./LessonPlayer";
import { LESSONS } from "@/data/curriculum";

// Pre-generate static pages for all 32 lessons at build time.
// This makes the app fully static-exportable for Cloudflare Pages.
export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

// Force this route to be static, not dynamic
export const dynamicParams = false;

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonPlayer lessonId={params.id} />;
}
