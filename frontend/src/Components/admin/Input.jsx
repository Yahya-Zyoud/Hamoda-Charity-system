function Input({ placeholder, value, onChange, type = "text", style = {} }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: "10px 16px",
        border: "2px solid #E2E8F0",
        borderRadius: 10,
        fontSize: 14,
        color: "#1E293B",
        background: "#fff",
        width: "100%",
        fontFamily: "'Tajawal',sans-serif",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#0891B2";
        e.target.style.boxShadow = "0 0 0 3px rgba(8,145,178,0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#E2E8F0";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

export default Input;