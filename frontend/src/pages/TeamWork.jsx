import { useState, useEffect } from "react";
import Navbar    from "../Components/Navbar";
import Footer    from "../Components/Footer";

import Hero      from "../Components/TeamWorkComp/Hero";
import Stats     from "../Components/TeamWorkComp/Stats";
import SearchBar from "../Components/TeamWorkComp/SearchBar";
import TeamGrid  from "../Components/TeamWorkComp/TeamGrid";

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
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── جلب البيانات من الباكند ──────────────────────────────
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/team");

        if (!res.ok) {
          throw new Error(`فشل الاتصال بالسيرفر (${res.status})`);
        }

        const data = await res.json();
        setTeam(Array.isArray(data) && data.length ? data : DEMO_TEAM);
        setError(null);
      } catch (err) {
        setTeam(DEMO_TEAM);
        setError("لا يمكن جلب بيانات الفريق من الخادم، يتم عرض بيانات تجريبية.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // ── تصفية البحث ─────────────────────────────────────────
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

      <Navbar />

      <main className="flex-1">

        <Hero />

        <Stats />

        <SearchBar search={search} setSearch={setSearch} />

        {/* Loading */}
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
            <span className="text-sm" style={{ color: "#64748b" }}>
              جاري تحميل بيانات الفريق...
            </span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="max-w-md mx-auto mt-12 text-center text-sm rounded-2xl p-5"
            style={{
              background: "rgba(234,33,67,0.07)",
              border: "1px solid rgba(234,33,67,0.2)",
              color: "#EA2143",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && <TeamGrid members={filtered} />}

      </main>

      <Footer />

    </div>
  );
}