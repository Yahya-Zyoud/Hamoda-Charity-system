import { useState } from "react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import { NOTIFICATIONS } from "../../data/mockAdminData";

function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAsRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="الإشعارات">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {unread > 0 && (
            <span style={{
              background: "#ECFEFF",
              color: "#0891B2",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid #A5F3FC",
            }}>
              {unread} غير مقروء
            </span>
          )}
        </div>
        {unread > 0 && (
          <Btn variant="outline" onClick={markAllRead}>
            ✓ تعيين الكل كمقروء
          </Btn>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ display: "grid", gap: 12 }}>
        {items.length === 0 && (
          <Card style={{ padding: "50px 20px", textAlign: "center", color: "#94A3B8" }}>
            📭 لا توجد إشعارات
          </Card>
        )}
        {items.map((n) => (
          <Card
            key={n.id}
            className="hover-lift"
            style={{
              padding: "16px 20px",
              borderRight: !n.read ? "4px solid #0891B2" : "4px solid transparent",
              background: !n.read ? "#FAFFFE" : "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 12, flex: 1 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: n.type === "request" ? "#ECFEFF" : n.type === "donation" ? "#F0FDF4" : "#F0F9FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {n.type === "request" ? "📋" : n.type === "donation" ? "💰" : "🔔"}
                </div>
                <div>
                  <div style={{ fontWeight: !n.read ? 700 : 500, marginBottom: 4, fontSize: 14 }}>{n.msg}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{n.time}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                {!n.read && (
                  <Btn sm variant="info-light" onClick={() => markAsRead(n.id)}>
                    تعليم كمقروء
                  </Btn>
                )}
                <Btn sm variant="danger-light" onClick={() => removeNotification(n.id)}>
                  حذف
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default NotificationsPage;