"use client";

import React, { useMemo, useState } from "react";
import type { StudentAssignmentDetail } from "@/types/student";
import { Status } from "@/features/student/status";
import { toFileUrl } from "@/lib/fileUrl";
import { download } from "@/lib/download";

function guessFilenameFromUrl(url: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last || "submission-file";
  } catch {
    const last = url.split("/").filter(Boolean).pop();
    return last || "submission-file";
  }
}

export function SubmissionInfo({ data }: { data: StudentAssignmentDetail }) {
  const sub = data.submission;

  const fileHref = useMemo(() => {
    if (!sub?.fileUrl) return null;
    return toFileUrl(sub.fileUrl);
  }, [sub?.fileUrl]);

  const urlHref = sub?.url ? sub.url : null;

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function onDownload() {
    if (!fileHref) return;
    setDownloadError(null);

    try {
      setDownloading(true);

      const res = await fetch(fileHref);
      if (!res.ok) {
        throw new Error(`Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const filename = guessFilenameFromUrl(fileHref);
      download(blob, filename);
    } catch (e: any) {
      setDownloadError(e?.message ?? "Gagal download file");
    } finally {
      setDownloading(false);
    }
  }

  if (!sub) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        Belum ada submission.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900">Your submission</div>
          <div className="text-xs text-slate-500 mt-1">
            Submitted: {new Date(sub.submittedAt).toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <Status tone="blue">Kind: {sub.kind}</Status>
          <Status tone={typeof sub.score === "number" ? "green" : "gray"}>
            Score: {sub.score ?? "-"}
          </Status>
        </div>
      </div>

      {sub.kind === "URL" && urlHref ? (
        <div className="text-sm text-slate-700">
          URL:{" "}
          <a
            href={urlHref}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {urlHref}
          </a>
        </div>
      ) : null}

      {sub.kind === "FILE" ? (
        <div className="space-y-2">
          <div className="text-sm text-slate-700">
            File:{" "}
            {fileHref ? (
              <a
                href={fileHref}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                Open file
              </a>
            ) : (
              <span className="text-slate-500">-</span>
            )}
          </div>

          {fileHref ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 disabled:opacity-60"
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          ) : null}

          {downloadError ? (
            <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2">
              {downloadError}
            </div>
          ) : null}
        </div>
      ) : null}

      {sub.feedback ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <div className="font-medium text-slate-900 mb-1">Feedback</div>
          <div className="whitespace-pre-wrap">{sub.feedback}</div>
        </div>
      ) : null}
    </div>
  );
}
