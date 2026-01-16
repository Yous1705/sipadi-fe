import AttendancePage from "./attendance-page";

interface Props {
  params: Promise<{ teachingAssigmentId: string }>;
}

export default async function Page({ params }: Props) {
  const { teachingAssigmentId } = await params;

  return <AttendancePage teachingAssigmentId={Number(teachingAssigmentId)} />;
}
