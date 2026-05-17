// Maps status strings (English and Arabic) to coloured pill badge styles.
const STATUS_CFG = {
  // Donation statuses
  pending:   { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
  accepted:  { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A" },
  rejected:  { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626" },
  // Help-request statuses
  approved:  { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A" },
  on_hold:   { label: "معلق",         bg: "#F3F4F6", color: "#6B7280" },
  // Project statuses (English + Arabic keys)
  active:    { label: "نشط",          bg: "#DBEAFE", color: "#2563EB" },
  completed: { label: "مكتمل",        bg: "#EDE9FE", color: "#7C3AED" },
  failed:    { label: "فشل",          bg: "#FEE2E2", color: "#DC2626" },
  نشط:       { label: "نشط",          bg: "#DBEAFE", color: "#2563EB" },
  مكتمل:     { label: "مكتمل",        bg: "#EDE9FE", color: "#7C3AED" },
  معلق:      { label: "معلق",         bg: "#F3F4F6", color: "#6B7280" },
};

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