import DashboardLayout from "../../Components/admin/DashboardLayout";
import StatCard from "../../Components/admin/StatCard";
import Card from "../../Components/admin/Card";
import Badge from "../../Components/admin/Badge";
import { STATS, MONTHLY, REQUEST_DIST, REQUESTS_DATA, DONATIONS_DATA } from "../../data/mockAdminData";

function OverviewPage() {
  const maxVal = Math.max(...MONTHLY.map((m) => m.v));
  const total = REQUEST_DIST.reduce((sum, item) => sum + item.count, 0);

  return (
    <DashboardLayout title="نظرة عامة">
      <div style={{ marginBottom: 20, color: "#64748B", fontSize: 14 }}>
        أكتوبر 2024
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="إجمالي التبرعات" value={`$${STATS.totalDonations.toLocaleString()}`} icon="💵" color="#16A34A" />
        <StatCard label="المستخدمون" value={STATS.totalUsers.toLocaleString()} icon="👥" color="#0891B2" />
        <StatCard label="الطلبات الواردة" value={STATS.totalRequests} icon="📋" color="#D97706" />
        <StatCard label="المشاريع الجارية" value={STATS.totalProjects} icon="✅" color="#0E7490" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Bar Chart */}
        <Card>
          <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>التبرعات الشهرية ($)</span>
          </div>
          <div style={{ padding: "16px 20px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
              {MONTHLY.map((m) => {
                const h = Math.round((m.v / maxVal) * 140);
                return (
                  <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div
                      title={`$${m.v.toLocaleString()}`}
                      style={{
                        width: "100%",
                        height: h,
                        background: "linear-gradient(to top, #0891B2, #5EEAD4)",
                        borderRadius: "4px 4px 0 0",
                        cursor: "pointer",
                        transition: "opacity 0.15s, transform 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = ".8"; e.currentTarget.style.transform = "scaleY(1.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1)"; }}
                    />
                    <span style={{ fontSize: 10, color: "#94A3B8", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 36, textAlign: "center" }}>
                      {m.m}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Request Distribution */}
        <Card>
          <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>توزيع الطلبات</span>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: "grid", gap: 12 }}>
              {REQUEST_DIST.map((item) => {
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={item.type}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 4, background: item.color }} />
                        <span style={{ fontSize: 14 }}>{item.type}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#64748B" }}>{item.count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: item.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 8, paddingTop: 10, borderTop: "1px solid #E2E8F0", fontWeight: 700 }}>
                المجموع: {total} طلب
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Requests & Donations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Recent Requests */}
        <Card>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>الطلبات الحديثة</span>
            <span style={{ background: "#FFFBEB", color: "#D97706", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid #FDE68A" }}>
              {STATS.pendingRequests} جديد
            </span>
          </div>
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            {REQUESTS_DATA.slice(0, 5).map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 10, borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{r.id} — {r.type}</div>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Donations */}
        <Card>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>أحدث التبرعات</span>
          </div>
          <div>
            {DONATIONS_DATA.slice(0, 4).map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #0891B2, #14B8A6)", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  {d.donor[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.donor}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.project}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>${d.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default OverviewPage;