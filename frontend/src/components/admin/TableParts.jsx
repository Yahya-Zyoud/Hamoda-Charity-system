// Shared table primitives (Th, Td, TableRow) used across all admin data tables.
export function Th({ children }) {
  return (
    <th
      style={{
        background: "#F8FFFE",
        color: "#64748B",
        fontWeight: 600,
        fontSize: 13,
        padding: "12px 14px",
        textAlign: "right",
        borderBottom: "2px solid #E2E8F0",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children, style = {} }) {
  return (
    <td
      style={{
        padding: "12px 14px",
        borderBottom: "1px solid #F1F5F9",
        fontSize: 14,
        color: "#374151",
        textAlign: "right",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

export function TableRow({ children }) {
  return (
    // Highlight the row on hover via inline style mutation (avoids a global CSS rule).
    <tr
      style={{ transition: "background 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FFFE")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
    >
      {children}
    </tr>
  );
}