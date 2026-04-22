function Select({ value, onChange, children, style = {} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: "10px 16px",
        border: "2px solid #E2E8F0",
        borderRadius: 10,
        fontSize: 14,
        color: "#1E293B",
        background: "#fff",
        fontFamily: "'Tajawal',sans-serif",
        cursor: "pointer",
        transition: "border-color 0.2s ease",
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderColor = "#0891B2")}
      onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
    >
      {children}
    </select>
  );
}

export default Select;