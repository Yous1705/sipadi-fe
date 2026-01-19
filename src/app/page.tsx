import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                Education Information System
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                SIPADI
              </h1>

              <p className="mt-4 text-lg text-slate-600 max-w-xl">
                Sistem Informasi Pembelajaran Terpadu untuk mendukung proses
                belajar mengajar yang lebih{" "}
                <span className="font-semibold text-slate-900">
                  terstruktur, transparan, dan efisien
                </span>
                .
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                >
                  Login ke SIPADI
                </Link>

                <div className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-medium text-center">
                  Student • Teacher • Admin
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Digunakan untuk pengelolaan pembelajaran berbasis peran.
              </p>
            </div>

            {/* RIGHT */}
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <h2 className="text-2xl font-semibold text-slate-900">
                Tentang SIPADI
              </h2>

              <p>
                <strong>SIPADI</strong> (Sistem Informasi Pembelajaran Digital)
                dirancang untuk membantu sekolah dan institusi pendidikan dalam
                mengelola aktivitas akademik secara terpusat dan terorganisir.
              </p>

              <p>
                Melalui SIPADI, siswa dapat memantau tugas dan absensi secara
                real-time, guru dapat mengelola kelas, tugas, serta penilaian
                dengan lebih mudah, dan admin dapat mengawasi keseluruhan sistem
                secara efisien.
              </p>

              <p>
                Fokus utama SIPADI adalah menciptakan alur pembelajaran yang
                jelas, mengurangi kesalahan administratif, serta meningkatkan
                transparansi antara siswa, guru, dan pihak sekolah.
              </p>

              <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                Dibangun dengan pendekatan modern, sederhana, dan berorientasi
                pada kebutuhan pengguna.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SIPADI
        </div>
      </div>
    </div>
  );
}
