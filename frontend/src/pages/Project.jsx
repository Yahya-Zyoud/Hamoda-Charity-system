import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Loader2 } from "lucide-react";

import Navbar       from "../Components/Navbar";
import Footer       from "../Components/Footer";

import ProjectHero    from "../Components/ProjectComp/ProjectHero";
import ProjectStats   from "../Components/ProjectComp/ProjectStats";
import ProjectFilters from "../Components/ProjectComp/ProjectFilters";
import ProjectGrid    from "../Components/ProjectComp/ProjectGrid";
import ProjectCTA     from "../Components/ProjectComp/ProjectCTA";
import * as api       from "../services/api";

// ── بيانات تجريبية تُستخدم إذا فشل الاتصال بالباكند ──────
const DEMO_PROJECTS = [
  {
    _id: "1",
    title: "بناء مركز صحي متكامل",
    category: "صحة",
    status: "نشط",
    description: "إنشاء مركز صحي شامل مجهز بأحدث المعدات الطبية لخدمة 10,000 مواطن في المناطق النائية.",
    goal: 100000, raised: 45000, beneficiaries: 10000,
    location: "منطقة القصيم", startDate: "2025-03-01",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
  {
    _id: "2",
    title: "برنامج التعليم المجاني",
    category: "تعليم",
    status: "نشط",
    description: "توفير التعليم المجاني والدعم الأكاديمي لـ 500 طالب من الأسر المحتاجة في جميع المراحل الدراسية.",
    goal: 80000, raised: 60000, beneficiaries: 500,
    location: "الرياض، جدة، الدمام", startDate: "2025-01-01",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  },
  {
    _id: "3",
    title: "توزيع السلال الغذائية",
    category: "إغاثة",
    status: "مكتمل",
    description: "توزيع سلال غذائية شهرية متكاملة تحتوي على المواد الأساسية على 300 أسرة محتاجة.",
    goal: 30000, raised: 30000, beneficiaries: 300,
    location: "جميع المناطق", startDate: "2024-11-01",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  },
  {
    _id: "4",
    title: "برنامج التدريب المهني",
    category: "تدريب",
    status: "مكتمل",
    description: "تدريب الشباب على المهارات العملية لتمكينهم من سوق العمل وتحقيق الاكتفاء الذاتي.",
    goal: 40000, raised: 40000, beneficiaries: 200,
    location: "نابلس", startDate: "2024-09-01",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    _id: "5",
    title: "رعاية أطفال ذوي الاحتياجات",
    category: "رعاية",
    status: "نشط",
    description: "تقديم الرعاية الشاملة والدعم اللازم للأطفال ذوي الاحتياجات الخاصة وأسرهم.",
    goal: 55000, raised: 22000, beneficiaries: 150,
    location: "فلسطين", startDate: "2024-01-01",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
  },
  {
    _id: "6",
    title: "إعادة إعمار المنازل",
    category: "إسكان",
    status: "نشط",
    description: "إعادة بناء وترميم المنازل المتضررة لتوفير مأوى آمن وكريم للعائلات المحتاجة.",
    goal: 120000, raised: 75000, beneficiaries: 80,
    location: "نابلس وضواحيها", startDate: "2024-01-01",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
];

=======
import { Loader2, FolderOpen } from "lucide-react";

import Navbar       from "../components/Navbar";
import Footer       from "../components/Footer";

import ProjectHero    from "../components/project/ProjectHero";
import ProjectStats   from "../components/project/ProjectStats";
import ProjectFilters from "../components/project/ProjectFilters";
import ProjectGrid    from "../components/project/ProjectGrid";
import ProjectCTA     from "../components/project/ProjectCTA";
import * as api       from "../services/api";

>>>>>>> MuradBranch
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
<<<<<<< HEAD
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("الكل");
  const [status,   setStatus]   = useState("الكل");
  const [pageError, setPageError] = useState(null);

  
  const loadProjects = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const [projectsData, statsData] = await Promise.all([
=======
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("الكل");
  const [status,   setStatus]   = useState("الكل");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsRes, statsRes] = await Promise.allSettled([
>>>>>>> MuradBranch
        api.getProjects(),
        api.getProjectStats(),
      ]);

<<<<<<< HEAD
      setProjects(Array.isArray(projectsData) && projectsData.length ? projectsData : DEMO_PROJECTS);
      setStats(statsData);
    } catch (err) {
      setProjects(DEMO_PROJECTS);
      setPageError(err.message || "لا يمكن جلب بيانات المشاريع من الخادم.");
=======
      if (projectsRes.status === "fulfilled") {
        setProjects(Array.isArray(projectsRes.value) ? projectsRes.value : []);
      } else {
        setError("تعذّر تحميل المشاريع. تأكد من تشغيل الخادم.");
      }

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
    } catch {
      setError("حدث خطأ غير متوقع أثناء تحميل المشاريع.");
>>>>>>> MuradBranch
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    loadProjects();
  }, []);

  
=======
  useEffect(() => { loadProjects(); }, []);

>>>>>>> MuradBranch
  const computedStats = stats || {
    total:         projects.length,
    active:        projects.filter((p) => p.status === "نشط").length,
    done:          projects.filter((p) => p.status === "مكتمل").length,
    beneficiaries: projects.reduce((s, p) => s + (p.beneficiaries || 0), 0),
  };

<<<<<<< HEAD
  // ── الفلترة ─────────────────────────────────────────────
=======
>>>>>>> MuradBranch
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchCat    = category === "الكل" || p.category === category;
    const matchStatus = status   === "الكل" || p.status   === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f0f9ff" }}>
<<<<<<< HEAD

      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <ProjectHero />

        {/* Stats */}
=======
      <Navbar />

      <main className="flex-1">
        <ProjectHero />
>>>>>>> MuradBranch
        <ProjectStats stats={computedStats} />

        <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
          <ProjectFilters
            search={search}     setSearch={setSearch}
            category={category} setCategory={setCategory}
            status={status}     setStatus={setStatus}
            total={projects.length}
            filtered={filtered.length}
          />
<<<<<<< HEAD

          {pageError && (
            <div
              className="rounded-2xl bg-red-50 p-5 text-sm text-red-700"
              style={{ border: "1px solid rgba(234,33,67,0.16)" }}
            >
              ⚠️ {pageError}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-24">
            <Loader2 className="animate-spin w-5 h-5" style={{ color: "#1856FF" }} />
            <span className="text-sm" style={{ color: "#64748b" }}>
              جاري تحميل المشاريع...
            </span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <ProjectGrid projects={filtered} />
        )}

        {/* CTA */}
        {!loading && <ProjectCTA />}

      </main>

      <Footer />

    </div>
  );
}
=======
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-3 py-24">
            <Loader2 className="animate-spin w-5 h-5" style={{ color: "#1856FF" }} />
            <span className="text-sm" style={{ color: "#64748b" }}>جاري تحميل المشاريع...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center px-6">
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <p style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.1rem" }}>{error}</p>
            <button
              onClick={loadProjects}
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
            <FolderOpen size={48} style={{ color: "#94a3b8" }} />
            <p style={{ color: "#64748b", fontWeight: 600, fontSize: "1.1rem" }}>
              لا توجد مشاريع متاحة حالياً
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ProjectGrid projects={filtered} />
        )}

        {!loading && <ProjectCTA />}
      </main>

      <Footer />
    </div>
  );
}
>>>>>>> MuradBranch
