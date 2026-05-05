import Card from "./Card";

function FilterTabs({ tabs, active, onChange }) {
  return (
    <Card style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 6, marginBottom: 16 }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            padding: "8px 16px",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Tajawal',sans-serif",
            fontWeight: 600,
            fontSize: 13,
            transition: "all 0.2s ease",
            background: active === t.key ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "transparent",
            color: active === t.key ? "#fff" : "#64748B",
            boxShadow: active === t.key ? "0 2px 8px rgba(37,99,235,0.25)" : "none",
          }}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              style={{
                marginRight: 6,
                background: active === t.key ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                color: active === t.key ? "#fff" : "#64748B",
                padding: "2px 8px",
                borderRadius: 20,
                fontSize: 11,
              }}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </Card>
  );
}

export default FilterTabs;