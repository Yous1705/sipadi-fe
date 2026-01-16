// "use client";
// import { getMyClasses } from "@/services/student/student.service";
// import { MyClasses } from "@/types/student";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// function ClassesCards() {
//   const [classes, setClasses] = useState<MyClasses>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     getMyClasses()
//       .then(setClasses)
//       .catch(() => setError("Gagal memuat kelas"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   if (!classes) return <div>Classes not found</div>;
//   return (
//     <div>
//       {classes.class.teachingAssigment.map((c) => (
//         <div className="border rounded p-4 space-y-2">
//           <div>
//             <p className="text-l font-medium">{c.subject.name}</p>
//             <p className="text-sm text-gray-600">{c.teacher.name}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ClassesCards;
