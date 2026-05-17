// Projects page: fetches projects and stats from the API, applies search/category/status filters
import { useState, useEffect } from "react";
import { Loader2, FolderOpen } from "lucide-react";

import Navbar       from "../components/Navbar";
import Footer       from "../components/Footer";

import ProjectHero    from "../components/project/ProjectHero";
import ProjectStats   from "../components/project/ProjectStats";
import ProjectFilters from "../components/project/ProjectFilters";
import ProjectGrid    from "../components/project/ProjectGrid";
import ProjectCTA     from "../components/project/ProjectCTA";
import * as api       from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("الكل");
  const [status,   setStatus]   = useState("الكل");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsRes, statsRes] = await Promise.allSettled([
        api.getProjects(),
        api.getProjectStats(),
      ]);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const computedStats = stats || {
    total:         projects.length,
    active:        projects.filter((p) => p.status === "نشط").length,
    done:          projects.filter((p) => p.status === "مكتمل").length,
    beneficiaries: projects.reduce((s, p) => s + (p.beneficiaries || 0), 0),
  };

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
        <ProjectHero />
        <ProjectStats stats={computedStats} />

        <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
          <ProjectFilters
            search={search}     setSearch={setSearch}
            category={category} setCategory={setCategory}
            status={status}     setStatus={setStatus}
            total={projects.length}
            filtered={filtered.length}
          />
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
