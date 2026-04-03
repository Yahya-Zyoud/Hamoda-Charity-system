function Btn({ children, variant = "primary", sm, onClick, style = {}, type = "button" }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    border: "none",
    fontFamily: "'Tajawal', sans-serif",
    fontSize: sm ? 13 : 14,
    padding: sm ? "6px 14px" : "10px 20px",
    transition: "all 0.2s ease",
  };

  const variants = {
    primary: { background: "linear-gradient(135deg, #0891B2, #14B8A6)", color: "#fff", boxShadow: "0 2px 8px rgba(8,145,178,0.25)" },
    success: { background: "linear-gradient(135deg, #16A34A, #22C55E)", color: "#fff", boxShadow: "0 2px 8px rgba(22,163,74,0.25)" },
    danger: { background: "#DC2626", color: "#fff" },
    outline: { background: "transparent", color: "#374151", border: "1px solid #D1D5DB" },
    ghost: { background: "transparent", color: "#64748B" },
    "success-light": { background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" },
    "danger-light": { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" },
    "info-light": { background: "#ECFEFF", color: "#0891B2", border: "1px solid #A5F3FC" },
    "warning-light": { background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" },
  };

  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export default Btn;