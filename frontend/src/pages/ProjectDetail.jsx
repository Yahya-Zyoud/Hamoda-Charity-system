import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, Target, Heart, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProjectById } from "../services/api";

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "long" });
}

function money(n) {
  return Number(n || 0).toLocaleString("ar-EG");
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProjectById(id)
      .then((data) => { if (!cancelled) setProject(data); })
      .catch((err) => { if (!cancelled) setError(err?.message || "تعذّر تحميل المشروع"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#64748b" }}>
          <Loader2 size={20} className="spin" /> جاري تحميل المشروع...
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div dir="rtl" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <AlertTriangle size={48} color="#ef4444" />
          <p style={{ color: "#ef4444", fontWeight: 700 }}>{error || "المشروع غير موجود"}</p>
          <Link to="/projects" style={{ color: "#1856FF", fontWeight: 700 }}>← العودة إلى المشاريع</Link>
        </div>
        <Footer />
      </>
    );
  }

  const progress = project.goal
    ? Math.min(Math.round(((project.raised || 0) / project.goal) * 100), 100)
    : 0;

  return (
    <>
      <Navbar />
      <main dir="rtl" style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
          <Link to="/projects" style={{ color: "#64748b", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
            <ArrowRight size={14} /> العودة إلى المشاريع
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 32px rgba(0,0,0,0.07)" }}
          >
            {project.image ? (
              <img src={project.image} alt={project.title} style={{ width: "100%", height: 320, objectFit: "cover" }} />
            ) : (
              <div style={{ height: 220, background: "linear-gradient(135deg,#dbeafe,#bbf7d0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={56} color="#1856FF" opacity={0.3} />
              </div>
            )}

            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {project.category && (
                  <span style={{ background: "#eff6ff", color: "#1856FF", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    {project.category}
                  </span>
                )}
                <span style={{ background: project.status === "completed" ? "#dcfce7" : "#fef3c7", color: project.status === "completed" ? "#16a34a" : "#92400e", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  {project.status === "active" ? "نشط" : project.status === "completed" ? "مكتمل" : "معلق"}
                </span>
              </div>

              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>{project.title}</h1>

              {project.description && (
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>{project.description}</p>
              )}

              {/* Progress */}
              <div style={{ background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: 14, padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "#1856FF", fontWeight: 700, fontSize: 14 }}>نسبة الإنجاز</span>
                  <span style={{ color: "#1856FF", fontWeight: 800, fontSize: 14 }}>{progress}%</span>
                </div>
                <div style={{ height: 10, background: "#e2e8f0", borderRadius: 9999, overflow: "hidden", marginBottom: 14 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{ height: "100%", background: "linear-gradient(90deg,#1856FF,#07CA6B)", borderRadius: 9999 }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, textAlign: "center" }}>
                  {[
                    { label: "الهدف", val: project.goal },
                    { label: "تم جمعه", val: project.raised || 0 },
                    { label: "المتبقي", val: Math.max((project.goal || 0) - (project.raised || 0), 0) },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 6px" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{money(val)} ₪</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26, padding: "16px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                {project.location && (
                  <div style={{ display: "flex", gap: 8, fontSize: 14, color: "#475569" }}>
                    <MapPin size={16} color="#1856FF" /> الموقع: <strong style={{ color: "#0f172a" }}>{project.location}</strong>
                  </div>
                )}
                {project.beneficiaries > 0 && (
                  <div style={{ display: "flex", gap: 8, fontSize: 14, color: "#475569" }}>
                    <Users size={16} color="#1856FF" /> المستفيدين: <strong style={{ color: "#0f172a" }}>{Number(project.beneficiaries).toLocaleString("ar-EG")}</strong>
                  </div>
                )}
                {project.startDate && (
                  <div style={{ display: "flex", gap: 8, fontSize: 14, color: "#475569" }}>
                    <Calendar size={16} color="#1856FF" /> تاريخ البدء: <strong style={{ color: "#0f172a" }}>{formatDate(project.startDate)}</strong>
                  </div>
                )}
              </div>

              {project.details && (
                <div style={{ marginBottom: 26 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>تفاصيل إضافية</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{project.details}</p>
                </div>
              )}

              <Link
                to={`/donations?projectId=${encodeURIComponent(project.id || project._id)}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "linear-gradient(135deg,#1856FF,#07CA6B)",
                  color: "white",
                  padding: "14px 24px",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 16,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(24,86,255,0.3)",
                }}
              >
                <Heart size={18} className="fill-current" /> تبرع لهذا المشروع
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
