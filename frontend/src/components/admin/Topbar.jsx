import { useState, useEffect } from "react";
import { Bell, ClipboardList, DollarSign } from "lucide-react";
import { getNotifications, markAllNotificationsRead } from "../../services/api";
import { useAppAuth } from "../../contexts/AppAuthContext";

const timeAgo = (dateStr) => {
  if (!dateStr) return "حديثاً";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
};

function Topbar({ title }) {
  const { user } = useAppAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const unread = notifs.filter((n) => !n.read).length;
  const displayName = user?.fullName || user?.firstName || "مشرف";
  const initials    = (user?.firstName?.[0] || user?.username?.[0] || displayName?.[0] || "م").toUpperCase();

  useEffect(() => {
    let cancelled = false;
    const fetch = () => {
      getNotifications()
        .then((data) => {
          if (cancelled) return;
          setNotifs((prev) => {
            const next = data.map((n) => ({ ...n, time: timeAgo(n.createdAt) }));
            // Preserve client-side "read" marks until the server catches up:
            // if the user marked-all-read locally, don't flip back on refresh.
            const prevById = new Map(prev.map((p) => [p._id, p]));
            return next.map((n) => {
              const old = prevById.get(n._id);
              return old?.read && !n.read ? { ...n, read: true } : n;
            });
          });
        })
        .catch(() => {});
    };
    fetch();
    // Poll every 30 seconds for new notifications. Cheap, no WebSocket needed.
    const interval = setInterval(fetch, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const markAll = () => {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead().catch(() => {});
  };

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
          <Bell size={18} />
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
                  <span style={{ flexShrink: 0, marginTop: 2, color: n.type === "request" ? "#D97706" : n.type === "donation" ? "#16A34A" : "#2563eb" }}>
                    {n.type === "request"
                      ? <ClipboardList size={16} />
                      : n.type === "donation"
                      ? <DollarSign size={16} />
                      : <Bell size={16} />}
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
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={displayName}
          title={displayName}
          className="topbar-avatar"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="topbar-avatar" title={displayName}>{initials}</div>
      )}
    </div>
  );
}

export default Topbar;