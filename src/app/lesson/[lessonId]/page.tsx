import TyconApp from "@/components/tycon-app";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  let decodedLessonId = lessonId;
  try { decodedLessonId = decodeURIComponent(lessonId); } catch { /* Invalid IDs are handled by the lesson guard. */ }
  return <TyconApp initialView="lesson" requestedLessonId={decodedLessonId} />;
}
