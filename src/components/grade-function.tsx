import {
  gradeAssignment,
  resetGradeAssignment,
} from "@/services/teacher/teacher-teaching.service";
import { Submission } from "@/types/assignment";
import Link from "next/link";
import { useState } from "react";

export function SubmissionRow({
  submission,
  refresh,
}: {
  submission: Submission;
  refresh: () => void;
}) {
  const [score, setScore] = useState<number | "">(submission.score ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (score === "") {
      alert("Score wajib diisi");
      return;
    }

    try {
      setSaving(true);
      await gradeAssignment(submission.id, {
        score: Number(score),
        feedback,
      });

      await refresh();
    } catch (e) {
      alert("Gagal menyimpan nilai");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 gap-4">
      <div className="flex-1">
        <p className="font-medium">{submission.student.name}</p>
        <p className="text-sm text-gray-500">
          Submitted: {new Date(submission.submittedAt).toLocaleString()}
        </p>

        {submission.fileUrl && (
          <Link
            href={submission.fileUrl}
            target="_blank"
            className="text-blue-600 hover:underline text-sm"
          >
            Download File
          </Link>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={0}
          max={100}
          value={score}
          onChange={(e) =>
            setScore(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="border rounded px-2 py-1 w-20 text-sm"
        />

        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 text-sm"
        >
          {saving ? "Saving..." : "Simpan"}
        </button>
        <button
          onClick={async () => {
            if (!confirm("Reset nilai siswa ini?")) return;
            await resetGradeAssignment(submission.id);
            refresh();
          }}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
