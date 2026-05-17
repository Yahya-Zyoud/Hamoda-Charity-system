// Admin reports page: KPI cards, monthly donation bar chart, project progress, and request-type distribution.
import { useState, useEffect } from "react";
import { Download, FileSpreadsheet, DollarSign, ClipboardList, TrendingUp, Users, Briefcase, Wallet, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Badge from "../../components/admin/Badge";
import Btn from "../../components/admin/Btn";
import { getAdminStats, getHelpRequests, getProjects } from "../../services/api";

const HELP_TYPE_AR = {
  medical: "طبي", education: "تعليم", food: "غذاء",
  housing: "إسكان", financial: "مالي", other: "أخرى",
};
const HELP_TYPE_COLORS = {
  medical: "#2563eb", education: "#0EA5E9", food: "#D97706",
  housing: "#16A34A", financial: "#8b5cf6", other: "#64748B",
};

const DB_STATUS_MAP = { "نشط": "active", "مكتمل": "completed", "موقف": "paused" };

function buildRequestDist(requests) {
  const counts = {};
  for (const r of requests) {
    const key = r.helpType || "other";
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([type, count]) => ({
      type:  HELP_TYPE_AR[type] || type,
      count,
      color: HELP_TYPE_COLORS[type] || "#64748B",
    }))
    .sort((a, b) => b.count - a.count);
}

function buildProjectPerf(projects) {
  return projects
    .filter((p) => p.goal || p.target)
    .map((p) => ({
      id:        p.id,
      title:     p.title || "—",
      target:    p.goal  || p.target    || 0,
      collected: p.raised || p.collected || 0,
      status:    DB_STATUS_MAP[p.status] || p.status || "active",
    }));
}

function ReportsPage() {
  const [stats,    setStats]    = useState(null);
  const [monthly,  setMonthly]  = useState([]);
  const [reqDist,  setReqDist]  = useState([]);
  const [projPerf, setProjPerf] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.allSettled([getAdminStats(), getHelpRequests(), getProjects()])
      .then(([adminRes, reqRes, projRes]) => {
        if (adminRes.status === "fulfilled") {
          const adminStats = adminRes.value;
          setStats(adminStats);
          setMonthly(adminStats.monthlyDonations || []);
        }
        if (reqRes.status === "fulfilled") {
          setReqDist(buildRequestDist(reqRes.value));
        }
        if (projRes.status === "fulfilled") {
          setProjPerf(buildProjectPerf(projRes.value));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const maxVal = monthly.length > 0 ? Math.max(...monthly.map((m) => m.v)) : 1;
  const totalDonationsDisplay = stats ? `$${(stats.totalDonations || 0).toLocaleString()}` : "—";

  return (
    <DashboardLayout title="التقارير والإحصاءات">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="outline"><Download size={15} style={{ marginLeft: 6 }} /> تصدير PDF</Btn>
          <Btn variant="outline"><FileSpreadsheet size={15} style={{ marginLeft: 6 }} /> تصدير Excel</Btn>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}

      {!loading && (
        <>
          {/* KPI Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "إجمالي التبرعات", value: totalDonationsDisplay, icon: <DollarSign size={20} color="#16A34A" />, up: true },
              { label: "إجمالي طلبات المساعدة", value: stats?.totalRequests ?? "—", icon: <ClipboardList size={20} color="#2563eb" />, up: true },
              { label: "طلبات معلقة", value: stats?.pendingRequests ?? "—", icon: <TrendingUp size={20} color="#D97706" />, up: false },
            ].map((k) => (
              <Card key={k.label} className="hover-lift" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: k.up ? "linear-gradient(135deg, #eff6ff, #F0FDF4)" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {k.icon}
                  </div>
                  <div style={{ fontSize: 13, color: "#94A3B8" }}>{k.label}</div>
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#0F172A" }}>{k.value}</div>
              </Card>
            ))}
          </div>

          {/* Monthly Chart */}
          <Card style={{ marginBottom: 20 }}>
            <div style={{ padding: "16px 20px 10px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>التبرعات الشهرية</span>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>{new Date().getFullYear()}</span>
            </div>
            <div style={{ padding: "16px 20px 20px" }}>
              {monthly.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 13 }}>لا توجد تبرعات مسجّلة هذا العام بعد</div>
              ) : (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200 }}>
                {monthly.map((m) => {
                  const h = Math.round((m.v / maxVal) * 170);
                  return (
                    <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>${(m.v / 1000).toFixed(1)}k</span>
                      <div
                        title={`$${m.v.toLocaleString()}`}
                        style={{ width: "100%", height: h, background: "linear-gradient(to top, #2563eb, #60a5fa)", borderRadius: "5px 5px 0 0", cursor: "pointer", transition: "opacity 0.15s, transform 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = ".8"; e.currentTarget.style.transform = "scaleY(1.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scaleY(1)"; }}
                      />
                      <span style={{ fontSize: 11, color: "#64748B" }}>{m.m.slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
              )}
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
                {projPerf.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#94A3B8", fontSize: 13 }}>
                    لا تتوفر بيانات جمع للمشاريع بعد
                  </div>
                ) : projPerf.map((p) => {
                  const pct = p.target ? Math.round((p.collected / p.target) * 100) : 0;
                  const barColor = pct >= 100 ? "#16A34A" : pct > 60 ? "#2563eb" : "#D97706";
                  return (
                    <div key={p.id} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</span>
                        <Badge status={p.status} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 5 }}>
                        <span>${p.collected.toLocaleString()} / ${p.target.toLocaleString()}</span>
                        <span style={{ fontWeight: 700, color: barColor }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: barColor }} />
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
                {reqDist.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#94A3B8", fontSize: 13 }}>
                    لا توجد طلبات مساعدة بعد
                  </div>
                ) : reqDist.map((d) => {
                  const total = reqDist.reduce((s, x) => s + x.count, 0);
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
                <Users size={18} color="#2563eb" />
                <span style={{ color: "#64748B", fontSize: 13 }}>المستخدمون:</span>
                <span style={{ fontWeight: 700 }}>{(stats?.totalUsers || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ClipboardList size={18} color="#D97706" />
                <span style={{ color: "#64748B", fontSize: 13 }}>الطلبات:</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalRequests || 0}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={18} color="#8b5cf6" />
                <span style={{ color: "#64748B", fontSize: 13 }}>المشاريع:</span>
                <span style={{ fontWeight: 700 }}>{stats?.totalProjects || 0}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Wallet size={18} color="#16A34A" />
                <span style={{ color: "#64748B", fontSize: 13 }}>التبرعات:</span>
                <span style={{ fontWeight: 700, color: "#16A34A" }}>${(stats?.totalDonations || 0).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}

export default ReportsPage;
