import DashboardLayout from "../../Components/admin/DashboardLayout";
import Card from "../../Components/admin/Card";
import Badge from "../../Components/admin/Badge";
import Btn from "../../Components/admin/Btn";
import { MONTHLY, REQUEST_DIST, PROJECTS_DATA, STATS } from "../../data/mockAdminData";

function ReportsPage() {
  const maxVal = Math.max(...MONTHLY.map((m) => m.v));
  const perf = PROJECTS_DATA.map((p) => ({
    ...p,
    pct: Math.round((p.collected / p.target) * 100),
  }));

  return (
    <DashboardLayout title="التقارير والإحصاءات">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="outline">📥 تصدير PDF</Btn>
          <Btn variant="outline">📊 تصدير Excel</Btn>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "إجمالي التبرعات هذا الشهر", value: "$17,700", change: "+13%", up: true, icon: "💰" },
          { label: "معدل قبول الطلبات", value: "68%", change: "+5%", up: true, icon: "📋" },
          { label: "متوسط قيمة التبرع", value: "$466", change: "-3%", up: false, icon: "📈" },
        ].map((k) => (
          <Card key={k.label} className="hover-lift" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: k.up ? "linear-gradient(135deg, #ECFEFF, #F0FDF4)" : "#FEF2F2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {k.icon}
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8" }}>{k.label}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: k.up ? "#16A34A" : "#DC2626", fontWeight: 600 }}>
              {k.up ? "↑" : "↓"} {k.change} عن الشهر الماضي
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Chart */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>التبرعات الشهرية</span>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>2024</span>
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
            {MONTHLY.map((m) => {
              const h = Math.round((m.v / maxVal) * 170);
              return (
                <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                    ${(m.v / 1000).toFixed(1)}k
                  </span>
                  <div
                    title={`$${m.v.toLocaleString()}`}
                    style={{
                      width: "100%",
                      height: h,
                      background: "linear-gradient(to top, #0891B2, #5EEAD4)",
                      borderRadius: "5px 5px 0 0",
                      cursor: "pointer",
                      transition: "opacity 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = ".8"; e.currentTarget.style.transform = "scaleY(1.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1)"; }}
                  />
                  <span style={{ fontSize: 11, color: "#64748B" }}>{m.m.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Project Performance */}
        <Card>
          <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>أداء المشاريع</span>
          </div>
          <div style={{ padding: "14px 20px" }}>
            {perf.map((p) => {
              const barColor = p.pct >= 100 ? "#16A34A" : p.pct > 60 ? "#0891B2" : "#D97706";
              return (
                <div key={p.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</span>
                    <Badge status={p.status} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 5 }}>
                    <span>${p.collected.toLocaleString()} / ${p.target.toLocaleString()}</span>
                    <span style={{ fontWeight: 700, color: barColor }}>{p.pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, p.pct)}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Request Distribution */}
        <Card>
          <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>توزيع الطلبات حسب النوع</span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {REQUEST_DIST.map((d) => {
              const total = REQUEST_DIST.reduce((s, x) => s + x.count, 0);
              const pct = Math.round((d.count / total) * 100);
              return (
                <div key={d.type} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                      {d.type}
                    </span>
                    <span style={{ color: "#64748B" }}>{d.count} طلب ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card style={{ padding: "18px 22px", marginTop: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>ملخص سريع</span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>👥</span>
            <span style={{ color: "#64748B", fontSize: 13 }}>المستخدمون:</span>
            <span style={{ fontWeight: 700 }}>{STATS.totalUsers.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <span style={{ color: "#64748B", fontSize: 13 }}>الطلبات:</span>
            <span style={{ fontWeight: 700 }}>{STATS.totalRequests}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>💼</span>
            <span style={{ color: "#64748B", fontSize: 13 }}>المشاريع:</span>
            <span style={{ fontWeight: 700 }}>{STATS.totalProjects}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>💵</span>
            <span style={{ color: "#64748B", fontSize: 13 }}>التبرعات:</span>
            <span style={{ fontWeight: 700, color: "#16A34A" }}>${STATS.totalDonations.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}

export default ReportsPage;
