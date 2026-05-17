// Toggle between "donate to a specific project" and "general donation" modes.
function DonationModeSelector({ mode, onChange }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">طريقة التبرع</span>
      <div className="dp-grid-2">
        <button
          type="button"
          className={`dp-mode-btn ${mode === "project" ? "active" : ""}`}
          onClick={() => onChange("project")}
        >
          <span className="dp-mode-icon">🎯</span>
          <span className="dp-mode-title">تبرع لمشروع</span>
          <span className="dp-mode-sub">اختر مشروعاً محدداً لتدعمه</span>
        </button>
        <button
          type="button"
          className={`dp-mode-btn ${mode === "general" ? "active" : ""}`}
          onClick={() => onChange("general")}
        >
          <span className="dp-mode-icon">💝</span>
          <span className="dp-mode-title">تبرع عام</span>
          <span className="dp-mode-sub">صدقة، زكاة، إغاثة، وغيرها</span>
        </button>
      </div>
    </div>
  );
}

export default DonationModeSelector;
