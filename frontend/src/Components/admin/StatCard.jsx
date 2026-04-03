import Card from "./Card";

function StatCard({ label, value, icon, color }) {
  return (
    <Card className="stat-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          border: `1px solid ${color}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>{label}</div>
      </div>
    </Card>
  );
}

export default StatCard;