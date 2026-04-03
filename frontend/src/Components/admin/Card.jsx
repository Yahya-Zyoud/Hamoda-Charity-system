function Card({ children, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #E2E8F0",
        transition: "box-shadow 0.2s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;