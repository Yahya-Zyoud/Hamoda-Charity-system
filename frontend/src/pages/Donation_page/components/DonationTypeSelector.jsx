const DONATION_TYPES = [
  { id: "صدقة",  label: "صدقة",  sub: "تبرع عام" },
  { id: "زكاة",  label: "زكاة",  sub: "زكي الإسلام" },
  { id: "إغاثة", label: "إغاثة", sub: "مساعدة طارئة" },
  { id: "إسكان", label: "إسكان", sub: "مأوى وسكن" },
  { id: "علاج",  label: "علاج",  sub: "رعاية صحية" },
  { id: "تعليم", label: "تعليم", sub: "دعم التعليم" },
];

function DonationTypeSelector({ donationType, onChange, error }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">نوع التبرع</span>
      <div className="dp-grid-3">
        {DONATION_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`dp-choice-btn ${donationType === type.id ? "active" : ""}`}
            onClick={() => onChange(type.id)}
          >
            <span className="dp-type-main">{type.label}</span>
            <span className="dp-type-sub">{type.sub}</span>
          </button>
        ))}
      </div>
      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default DonationTypeSelector;
