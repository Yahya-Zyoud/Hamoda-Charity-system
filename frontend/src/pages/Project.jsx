import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import Navbar       from "../Components/Navbar";

import ProjectHero    from "../Components/ProjectComp/ProjectHero";
import ProjectStats   from "../Components/ProjectComp/ProjectStats";
import ProjectFilters from "../Components/ProjectComp/ProjectFilters";
import ProjectGrid    from "../Components/ProjectComp/ProjectGrid";
import ProjectCTA     from "../Components/ProjectComp/ProjectCTA";

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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("الكل");
  const [status,   setStatus]   = useState("الكل");

  // ── جلب البيانات ────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projRes, statsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/projects/stats"),
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(data.length ? data : DEMO_PROJECTS);
        } else {
          setProjects(DEMO_PROJECTS);
        }

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
      } catch {
        // fallback للبيانات التجريبية
        setProjects(DEMO_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── حساب الإحصاءات من الـ demo إذا ما وصل الباكند ───────
  const computedStats = stats || {
    total:         projects.length,
    active:        projects.filter((p) => p.status === "نشط").length,
    done:          projects.filter((p) => p.status === "مكتمل").length,
    beneficiaries: projects.reduce((s, p) => s + (p.beneficiaries || 0), 0),
  };

  // ── الفلترة ─────────────────────────────────────────────
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

      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <ProjectHero />

        {/* Stats */}
        <ProjectStats stats={computedStats} />

        {/* Filters + counter */}
        <ProjectFilters
          search={search}     setSearch={setSearch}
          category={category} setCategory={setCategory}
          status={status}     setStatus={setStatus}
          total={projects.length}
          filtered={filtered.length}
        />

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
        {!loading && <ProjectGrid projects={filtered} />}

        {/* CTA */}
        {!loading && <ProjectCTA />}

      </main>

     

    </div>
  );
}