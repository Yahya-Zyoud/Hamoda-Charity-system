import Card from "./Card";

function StatCard({ label, value, icon: Icon, color, trend, context, onClick }) {
  return (
    <Card
      className="stat-card"
      style={{
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 13,
          background: `linear-gradient(135deg, ${color}22, ${color}10)`,
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={20} style={{ color }} strokeWidth={2} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{label}</div>
        {context && (
          <div style={{ fontSize: 11, color: "#9AA5B5", marginTop: 2 }}>{context}</div>
        )}
      </div>

      {trend && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: trend.startsWith("+") ? "#16A34A" : "#DC2626",
            background: trend.startsWith("+") ? "#F0FDF4" : "#FEF2F2",
            padding: "2px 8px",
            borderRadius: 20,
            flexShrink: 0,
            border: `1px solid ${trend.startsWith("+") ? "#BBF7D0" : "#FECACA"}`,
          }}
        >
          {trend}
        </div>
      )}
    </Card>
  );
}

export default StatCard;
