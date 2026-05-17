// Fetches active projects and lets the donor select one; shows a funding-progress bar per card.
import { useEffect, useState } from "react";
import { getProjects } from "../../../services/api";

function ProjectPicker({ selectedId, onSelect, error }) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(false);

  useEffect(() => {
    getProjects()
      .then((data) => {
        const active = data.filter((p) => p.status === "نشط" || p.status === "active");
        setProjects(active);
      })
      .catch(() => setFetchErr(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dp-section">
        <span className="dp-section-label">اختر المشروع</span>
        <div className="dp-projects-loading">جاري تحميل المشاريع…</div>
      </div>
    );
  }

  if (fetchErr || projects.length === 0) {
    return (
      <div className="dp-section">
        <span className="dp-section-label">اختر المشروع</span>
        <div className="dp-projects-empty">
          {fetchErr ? "تعذّر تحميل المشاريع" : "لا توجد مشاريع نشطة حالياً"}
        </div>
      </div>
    );
  }

  return (
    <div className="dp-section">
      <span className="dp-section-label">اختر المشروع</span>
      <div className="dp-projects-grid">
        {projects.map((p) => {
          const pct = p.goal > 0 ? Math.min(100, Math.round(((p.raised || 0) / p.goal) * 100)) : 0;
          const isSelected = selectedId === (p.id || p._id);
          return (
            <button
              key={p.id || p._id}
              type="button"
              className={`dp-project-card ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(p)}
            >
              <div className="dp-project-name">{p.title}</div>
              {p.category && <div className="dp-project-cat">{p.category}</div>}
              <div className="dp-project-bar-track">
                <div className="dp-project-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="dp-project-meta">
                <span>{pct}% مكتمل</span>
                <span>الهدف: ${(p.goal || 0).toLocaleString()}</span>
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default ProjectPicker;
