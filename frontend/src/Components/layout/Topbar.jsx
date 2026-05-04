import { useState } from "react";
import { NOTIFICATIONS } from "../../data/mockAdminData";

function Topbar({ title }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;

  const markAll = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));

  return (
    <div className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-spacer" />

      {/* Notification Bell */}
      <div style={{ position: "relative" }}>
        <button
          className="topbar-bell"
          onClick={() => setShowNotifs((p) => !p)}
        >
          🔔
          {unread > 0 && <span className="topbar-bell-badge">{unread}</span>}
        </button>

        {showNotifs && (
          <div className="notif-dropdown">
            <div className="notif-header">
              <span style={{ fontWeight: 700 }}>الإشعارات</span>
              {unread > 0 && (
                <button
                  onClick={markAll}
                  style={{
                    fontSize: 12,
                    color: "#2563eb",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Tajawal',sans-serif",
                  }}
                >
                  تعيين الكل كمقروء
                </button>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                  onClick={() =>
                    setNotifs((p) =>
                      p.map((x) =>
                        x.id === n.id ? { ...x, read: true } : x
                      )
                    )
                  }
                >
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>
                    {n.type === "request"
                      ? "📋"
                      : n.type === "donation"
                      ? "💰"
                      : "🔔"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#1E293B",
                        lineHeight: 1.4,
                        marginBottom: 2,
                      }}
                    >
                      {n.msg}
                    </p>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>
                      {n.time}
                    </span>
                  </div>
                  {!n.read && (
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#2563eb",
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="notif-footer">
              <button onClick={() => setShowNotifs(false)}>إغلاق</button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="topbar-avatar">م</div>
    </div>
  );
}

export default Topbar;
