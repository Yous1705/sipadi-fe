import AttendanceDetailPage from "./attendance-detail";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { sessionId } = await params;

  return <AttendanceDetailPage sessionId={Number(sessionId)} />;
}
