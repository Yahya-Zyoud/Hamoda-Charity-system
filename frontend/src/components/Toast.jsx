// Toast notification system: useToast hook manages a queue; ToastContainer renders them fixed bottom-left.
import { useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

/* ── Hook ──────────────────────────────────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, remove };
}

/* ── Container ─────────────────────────────────────────────────────────────── */
export function ToastContainer({ toasts, remove }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10,
      pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={remove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: isSuccess ? "#F0FDF4" : "#FFF1F2",
        border: `1px solid ${isSuccess ? "#BBF7D0" : "#FECDD3"}`,
        color: isSuccess ? "#15803D" : "#BE123C",
        borderRadius: 12, padding: "12px 16px",
        boxShadow: "0 4px 24px rgba(0,0,0,.12)",
        fontSize: 14, fontWeight: 600,
        minWidth: 260, maxWidth: 380,
        pointerEvents: "all",
        animation: "toast-in .25s ease",
      }}
    >
      {isSuccess
        ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
        : <XCircle size={18} style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, lineHeight: 1, flexShrink: 0 }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

/* Inject keyframes once */
if (typeof document !== "undefined" && !document.getElementById("toast-kf")) {
  const s = document.createElement("style");
  s.id = "toast-kf";
  s.textContent = `@keyframes toast-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(s);
}
