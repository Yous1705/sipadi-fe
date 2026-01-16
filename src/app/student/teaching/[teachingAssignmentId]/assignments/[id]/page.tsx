// "use client";
// import {
//   getStudentAssignmentDetail,
//   submitAssignment,
// } from "@/services/student/student.service";
// import { StudentAssignmentDetail } from "@/types/student";
// import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// function AssignmentDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();

//   const [data, setData] = useState<StudentAssignmentDetail | null>(null);
//   const [fileUrl, setFileUrl] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     getStudentAssignmentDetail(Number(id))
//       .then(setData)
//       .catch(() => setError("Gagal memuat tugas"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   async function handleSubmit() {
//     if (!fileUrl) {
//       return setError("File tidak boleh kosong");
//     }

//     try {
//       setSubmitting(true);
//       console.log("[FE] submit payload:", {
//         assignmentId: Number(id),
//         fileUrl,
//         fileUrlType: typeof fileUrl,
//       });
//       await submitAssignment(Number(id), fileUrl);
//       router.refresh();
//       const updated = await getStudentAssignmentDetail(Number(id));
//       setData(updated);
//       setFileUrl("");
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }
//   if (!data) {
//     return <div>Tugas tidak ditemukan</div>;
//   }
//   if (!fileUrl) {
//     return setError("File tidak boleh kosong");
//   }

//   const submission = data.submissions[0];
//   return (
//     <div className="p-6 space-y-6 max-w-2xl">
//       <div>
//         <h1 className="text-2xl font-semibold">{data.title}</h1>
//         <p className="text-gray-600 mt-1">
//           {data.teachingAssigment.subject.name}{" "}
//           {data.teachingAssigment.teacher.name}
//         </p>
//         <p className="text-sm mt-2">
//           Due: {new Date(data.dueDate).toLocaleDateString()}
//         </p>
//       </div>

//       {data.description && <p className="text-gray-800"> {data.description}</p>}

//       <div className="border-t pt-4 space-y-4">
//         {submission ? (
//           <div className="space-y-2">
//             <p className="text-green-600 font-medium">
//               Assignment sudah dikumpulkan
//             </p>
//             <p className="text-sm">
//               File:{" "}
//               <a
//                 href={submission.fileUrl}
//                 className="underline"
//                 target="_blank"
//               >
//                 lihat File
//               </a>
//             </p>
//             {submission.score !== null && (
//               <p className="font-medium">Score: {submission.score}</p>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h2 className="font-medium">Submit Assignment</h2>

//             <input
//               className="border p-2 w-full"
//               placeholder="File URL"
//               value={fileUrl}
//               onChange={(e) => setFileUrl(e.target.value)}
//             />

//             <button
//               disabled={submitting}
//               onClick={handleSubmit}
//               className="bg-black text-white px-4 py-2 disabled:opacity-50"
//             >
//               {submitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AssignmentDetailPage;
