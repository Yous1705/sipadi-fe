"use client";

import StudentNavbar from "@/components/student-navbar";
import {
  getAssignmentDetail,
  submitAssignmentFile,
  submitAssignmentUrl,
} from "@/services/student/student.service";
import { StudentAssignmentDetail, SubmissionPolicy } from "@/types/student";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function StudentAssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const aid = Number(assignmentId);

  const classIdQ = searchParams.get("classId");
  const backClassId = classIdQ ? Number(classIdQ) : null;

  const [data, setData] = useState<StudentAssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<"URL" | "FILE">("URL");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const backHref = useMemo(() => {
    if (data?.teachingAssigmentId)
      return `/student/subjects/${data.teachingAssigmentId}`;
    const cid = data?.classId ?? backClassId;
    if (cid) return `/student/classes/${cid}`;
    return "/student";
  }, [data, backClassId]);

  useEffect(() => {
    if (!aid) return;

    setLoading(true);
    setError(null);

    getAssignmentDetail(aid)
      .then((d: any) => {
        setData(d);
        setSuccess(null);
        const p: SubmissionPolicy = d.submissionPolicy;
        if (p === "FILE_ONLY") setMode("FILE");
        else setMode("URL");
      })
      .catch((e: any) =>
        setError(e?.message ?? e?.error ?? "Gagal memuat assignment")
      )
      .finally(() => setLoading(false));
  }, [aid]);

  const isLate = data ? new Date(data.dueDate) < new Date() : false;
  const policy: SubmissionPolicy | null = data?.submissionPolicy ?? null;
  const maxMb = data?.maxFileSizeMb ?? 2;

  async function onSubmit() {
    if (!data) return;
    setError(null);
    setSuccess(null);

    if (isLate) {
      setError("Deadline sudah lewat");
      return;
    }

    try {
      setSubmitting(true);

      const useUrl =
        policy === "URL_ONLY" || (policy === "URL_OR_FILE" && mode === "URL");

      if (useUrl) {
        if (!url.trim()) {
          setError("URL wajib diisi");
          return;
        }
        await submitAssignmentUrl(aid, url.trim());
      } else {
        if (!file) {
          setError("File wajib dipilih");
          return;
        }
        if (file.size > maxMb * 1024 * 1024) {
          setError(`Ukuran file melebihi ${maxMb}MB`);
          return;
        }
        await submitAssignmentFile(aid, file);
      }

      const fresh = await getAssignmentDetail(aid);
      setData(fresh);
      setUrl("");
      setFile(null);
      setSuccess("Berhasil submit");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Gagal submit assignment");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <StudentNavbar />
        <div className="max-w-3xl mx-auto p-6">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <StudentNavbar />
        <div className="max-w-3xl mx-auto p-6">Assignment not found</div>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-gray-600">
              {data.subjectName} • {data.teacherName}
            </p>
            <p className="text-sm mt-1">
              Due: {new Date(data.dueDate).toLocaleString()}
            </p>
            {isLate && (
              <p className="text-red-600 text-sm mt-1">Deadline sudah lewat</p>
            )}
          </div>

          <Link href={backHref} className="text-sm underline">
            Back
          </Link>
        </div>

        <div className="border rounded-xl p-4">
          <div className="font-semibold mb-2">Description</div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {data.description}
          </p>
        </div>

        {data.submission ? (
          <div className="border rounded-xl p-4 space-y-2">
            <div className="font-semibold text-green-700">
              Sudah dikumpulkan
            </div>
            <p className="text-sm">
              Submitted at:{" "}
              {new Date(data.submission.submittedAt).toLocaleString()}
            </p>

            {data.submission.kind === "URL" && data.submission.url && (
              <a
                className="text-sm underline"
                target="_blank"
                href={data.submission.url}
              >
                Lihat URL
              </a>
            )}

            {data.submission.kind === "FILE" && data.submission.fileUrl && (
              <a
                className="text-sm underline"
                target="_blank"
                href={data.submission.fileUrl}
              >
                Download/Lihat File
              </a>
            )}

            <p className="text-sm">
              Score:{" "}
              <span className="font-semibold">
                {data.submission.score ?? "-"}
              </span>
            </p>
            {data.submission.feedback && (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                Feedback: {data.submission.feedback}
              </p>
            )}

            {!isLate && (
              <div className="pt-2 text-xs text-gray-500">
                Kamu masih bisa resubmit sebelum dueDate.
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-xl p-4 space-y-3">
            <div className="font-semibold">Submit Assignment</div>

            {policy === "URL_OR_FILE" && (
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 border rounded-lg text-sm ${
                    mode === "URL" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setMode("URL")}
                >
                  Submit URL
                </button>
                <button
                  className={`px-3 py-2 border rounded-lg text-sm ${
                    mode === "FILE" ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setMode("FILE")}
                >
                  Upload File
                </button>
              </div>
            )}

            {(policy === "URL_ONLY" ||
              (policy === "URL_OR_FILE" && mode === "URL")) && (
              <input
                type="text"
                placeholder="Paste URL file (Drive/S3/dll)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
            )}

            {(policy === "FILE_ONLY" ||
              (policy === "URL_OR_FILE" && mode === "FILE")) && (
              <div className="space-y-2">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-gray-500">Max size: {maxMb}MB</p>
              </div>
            )}

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-700 text-sm">{success}</div>}

            <button
              onClick={onSubmit}
              disabled={submitting || isLate}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default StudentAssignmentDetailPage;
