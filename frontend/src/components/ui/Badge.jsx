import { STATUS_CFG } from "../../data/mockAdminData";

function Badge({ status }) {
  const c = STATUS_CFG[status] || {
    label: status,
    bg: "#F3F4F6",
    color: "#6B7280",
  };

  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-block",
        whiteSpace: "nowrap",
        border: `1px solid ${c.color}20`,
      }}
    >
      {c.label}
    </span>
  );
}

export default Badge;
