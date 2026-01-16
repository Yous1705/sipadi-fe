import { apiFetch } from "@/lib/client";
import { ClassResponse } from "@/types/student";


export async function getClassHub(classId: number) {
  return apiFetch<ClassResponse>(`/student/classes/${classId}`.
    {method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    }
  );
}

function getToken() {
  const match = document.cookie.match(/sipadi_token=([^;]+)/);
  return match?.[1];
}