import { useState, useEffect } from "react";
import { Check, BellOff, ClipboardList, DollarSign, Bell, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/api";

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

const normalize = (n) => ({
  id:   n.id,
  type: n.type,
  msg:  n.msg,
  time: timeAgo(n.createdAt),
  read: n.read,
});

function NotificationsPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    getNotifications()
      .then((data) => setItems(data.map(normalize)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const markRead = (id) => {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
    markNotificationRead(id).catch(() => {});
  };

  const markAll = () => {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead().catch(() => {});
  };

  const remove = (id) => {
    setItems((p) => p.filter((n) => n.id !== id));
    deleteNotification(id).catch(() => {});
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="الإشعارات">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          {unread > 0 && (
            <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid #bfdbfe" }}>
              {unread} غير مقروء
            </span>
          )}
        </div>
        {unread > 0 && (
          <Btn variant="outline" onClick={markAll}>
            <Check size={14} style={{ marginLeft: 5 }} /> تعيين الكل كمقروء
          </Btn>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}

      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل الإشعارات: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <div style={{ display: "grid", gap: 12 }}>
          {items.length === 0 && (
            <Card style={{ padding: "50px 20px", textAlign: "center", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <BellOff size={18} /> لا توجد إشعارات
            </Card>
          )}
          {items.map((n) => (
            <Card
              key={n.id}
              className="hover-lift"
              style={{
                padding: "16px 20px",
                borderRight: !n.read ? "4px solid #2563eb" : "4px solid transparent",
                background:  !n.read ? "#f8faff" : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, flex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: n.type === "request" ? "#eff6ff" : n.type === "donation" ? "#F0FDF4" : "#F0F9FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {n.type === "request"
                      ? <ClipboardList size={18} color="#D97706" />
                      : n.type === "donation"
                      ? <DollarSign size={18} color="#16A34A" />
                      : <Bell size={18} color="#2563eb" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: !n.read ? 700 : 500, marginBottom: 4, fontSize: 14 }}>{n.msg}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{n.time}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                  {!n.read && (
                    <Btn sm variant="info-light" onClick={() => markRead(n.id)}>تعليم كمقروء</Btn>
                  )}
                  <Btn sm variant="danger-light" onClick={() => remove(n.id)}>حذف</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default NotificationsPage;
