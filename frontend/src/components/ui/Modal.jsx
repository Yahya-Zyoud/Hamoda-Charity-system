import Card from "./Card";

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <Card style={{ maxHeight: "88vh", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 22px",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
            <button
              onClick={onClose}
              style={{
                background: "#F1F5F9",
                border: "none",
                width: 32,
                height: 32,
                borderRadius: 9,
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#DC2626";
                e.target.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#F1F5F9";
                e.target.style.color = "#64748B";
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: 22 }}>{children}</div>
        </Card>
      </div>
    </div>
  );
}

export default Modal;
