import { useState, useEffect } from "react";
<<<<<<< HEAD
import Navbar    from "../Components/Navbar";
import Footer    from "../Components/Footer";

import Hero      from "../Components/TeamWorkComp/Hero";
import Stats     from "../Components/TeamWorkComp/Stats";
import SearchBar from "../Components/TeamWorkComp/SearchBar";
import TeamGrid  from "../Components/TeamWorkComp/TeamGrid";
import * as api  from "../services/api";

const DEMO_TEAM = [
  {
    _id: "demo-1",
    name: "د. نورة العلي",
    title: "مديرة البرامج الطبية",
    role: "دكتور",
    description: "قيادة الفريق الطبي وتنسيق حملات العلاج والرعاية الصحية للمحتاجين.",
    email: "noura@example.com",
    phone: "+966500000001",
    initials: "ن الع",
  },
  {
    _id: "demo-2",
    name: "أ. محمد السالم",
    title: "منسق المشاريع",
    role: "إدارة",
    description: "متابعة تنفيذ المشاريع الخيرية وضمان وصول الدعم للمستفيدين بشكل فعال.",
    email: "mohammed@example.com",
    phone: "+966500000002",
    initials: "م س",
  },
  {
    _id: "demo-3",
    name: "فاطمة الشمري",
    title: "متطوعة اجتماعية",
    role: "متطوع",
    description: "تنظيم الفعاليات الجماعية وجمع التبرعات لدعم الأسر المحتاجة.",
    email: "fatima@example.com",
    phone: "+966500000003",
    initials: "ف ش",
  },
  {
    _id: "demo-4",
    name: "أ. سامي الحربي",
    title: "موظف دعم فني",
    role: "موظف",
    description: "دعم القسم التقني وتقوية الأنظمة الرقمية لسهولة التواصل مع المتبرعين.",
    email: "sami@example.com",
    phone: "+966500000004",
    initials: "س ح",
  },
];

export default function TeamWork() {
  const [team,    setTeam]    = useState(DEMO_TEAM);
=======
import Navbar    from "../components/Navbar";
import Footer    from "../components/Footer";

import Hero      from "../components/team/Hero";
import Stats     from "../components/team/Stats";
import SearchBar from "../components/team/SearchBar";
import TeamGrid  from "../components/team/TeamGrid";
import * as api  from "../services/api";

export default function TeamWork() {
  const [team,    setTeam]    = useState([]);
>>>>>>> MuradBranch
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTeam();
<<<<<<< HEAD
      setTeam(Array.isArray(data) && data.length ? data : DEMO_TEAM);
    } catch (err) {
      setTeam(DEMO_TEAM);
      setError(err.message || "لا يمكن جلب بيانات الفريق من الخادم، يتم عرض بيانات تجريبية.");
=======
      setTeam(Array.isArray(data) ? data : []);
    } catch {
      setError("تعذّر تحميل بيانات الفريق. تأكد من تشغيل الخادم.");
      setTeam([]);
>>>>>>> MuradBranch
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    loadTeam();
  }, []);

  // ── تصفية البحث ─────────────────────────────────────────
=======
  useEffect(() => { loadTeam(); }, []);

>>>>>>> MuradBranch
  const filtered = team.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q)        ||
      m.role?.toLowerCase().includes(q)        ||
      m.title?.toLowerCase().includes(q)       ||
      m.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f0f9ff" }}>
<<<<<<< HEAD

      <Navbar />

      <main className="flex-1">

        <Hero />

=======
      <Navbar />

      <main className="flex-1">
        <Hero />
>>>>>>> MuradBranch
        <Stats />

        <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
          <SearchBar search={search} setSearch={setSearch} />
<<<<<<< HEAD

          {error && (
            <div
              className="rounded-2xl bg-red-50 p-5 text-sm text-red-700"
              style={{ border: "1px solid rgba(234,33,67,0.16)" }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Loading */}
=======
        </div>

>>>>>>> MuradBranch
        {loading && (
          <div className="flex justify-center items-center gap-3 py-24">
            <svg
              className="animate-spin w-5 h-5"
              style={{ color: "#1856FF" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
<<<<<<< HEAD
            <span className="text-sm" style={{ color: "#64748b" }}>
              جاري تحميل بيانات الفريق...
            </span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <TeamGrid members={filtered} />
        )}

      </main>

      <Footer />

    </div>
  );
}
=======
            <span className="text-sm" style={{ color: "#64748b" }}>جاري تحميل بيانات الفريق...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <p style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.1rem" }}>{error}</p>
            <button
              onClick={loadTeam}
              style={{
                background: "#2563eb", color: "white", border: "none",
                borderRadius: "0.5rem", padding: "0.6rem 1.5rem",
                fontWeight: 700, cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
            <span style={{ fontSize: "3rem" }}>👥</span>
            <p style={{ color: "#64748b", fontWeight: 600, fontSize: "1.1rem" }}>
              لا يوجد أعضاء في الفريق حالياً
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <TeamGrid members={filtered} />
        )}
      </main>

      <Footer />
    </div>
  );
}
>>>>>>> MuradBranch
