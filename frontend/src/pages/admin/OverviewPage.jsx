import { useState, useEffect } from "react";
import {
  DollarSign, Users, ClipboardList, CheckCircle2,
  TrendingUp, BarChart3, Calendar, AlertTriangle,
  AlertCircle, Plus, FileText, Wallet, ArrowUpRight, Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/admin/DashboardLayout";
import StatCard from "../../components/admin/StatCard";
import Card from "../../components/admin/Card";
import Badge from "../../components/admin/Badge";
import { getAdminStats } from "../../services/api";
import {
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis,
  Tooltip, Bar, Cell, PieChart, Pie, Legend,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.38, ease: "easeOut" } }),
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ color: "#9AA5B5", fontSize: 11, marginBottom: 2 }}>{label}</div>
      <div>${payload[0].value.toLocaleString()}</div>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f172a", color: "#fff", padding: "7px 13px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
      {payload[0].name}: {payload[0].value} طلب
    </div>
  );
};


function OverviewPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const live = stats ?? {
    totalDonations: 0, totalProjects: 0, totalRequests: 0,
    totalUsers: 0, pendingRequests: 0,
    recentRequests: [], recentDonations: [],
    monthlyDonations: [], requestsByType: [],
  };

  const bestMonth = live.monthlyDonations.length > 0
    ? live.monthlyDonations.reduce((a, b) => (a.v > b.v ? a : b))
    : null;

  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const STATS_CONFIG = [
    { label: "إجمالي التبرعات",  value: `$${live.totalDonations.toLocaleString()}`, icon: DollarSign,    color: "#16A34A", trend: "+18%", context: "مقارنة بالشهر الماضي", to: "/admin/dashboard/donations" },
    { label: "المستخدمون",       value: live.totalUsers.toLocaleString(),            icon: Users,         color: "#2563eb", trend: "+12%", context: "مستخدم مسجل",           to: "/admin/dashboard/users"     },
    { label: "الطلبات الواردة",  value: live.totalRequests,                          icon: ClipboardList, color: "#D97706", trend: "+5%",  context: `${live.pendingRequests} قيد المراجعة`, urgent: true, to: "/admin/dashboard/requests" },
    { label: "المشاريع الجارية", value: live.totalProjects,                          icon: CheckCircle2,  color: "#8B5CF6", trend: "-2%",  context: "مشاريع مسجّلة",          to: "/admin/dashboard/projects"  },
  ];

  const QUICK_ACTIONS = [
    { label: "إضافة مشروع",     icon: Plus,    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", to: "/admin/dashboard/projects"  },
    { label: "مراجعة الطلبات", icon: FileText, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", badge: live.pendingRequests, to: "/admin/dashboard/requests" },
    { label: "إدارة التبرعات", icon: Wallet,   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", to: "/admin/dashboard/donations" },
  ];

  const ALERTS = [
    live.pendingRequests > 0 && {
      level: "danger", icon: AlertCircle,
      title: `${live.pendingRequests} طلب${live.pendingRequests > 1 ? " بانتظار" : " ينتظر"} قرار`,
      desc: "راجع قسم الطلبات للاطلاع على الحالات العاجلة",
      action: "مراجعة الطلبات", to: "/admin/dashboard/requests",
    },
    live.totalProjects > 0 && {
      level: "warning", icon: AlertTriangle,
      title: `${live.totalProjects} مشروع مسجّل يحتاج متابعة`,
      desc: "راجع قسم المشاريع لمتابعة نسب الإنجاز",
      action: "عرض المشاريع", to: "/admin/dashboard/projects",
    },
  ].filter(Boolean);

  return (
    <DashboardLayout title="نظرة عامة" showHeader={false}>

      {/* ── 1. Mission Banner ─────────────────────────────────── */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" className="mission-banner">
        <div className="mission-banner-orb mission-banner-orb-1" />
        <div className="mission-banner-orb mission-banner-orb-2" />
        <div className="mission-banner-orb mission-banner-orb-3" />
        <div>
          <div className="mission-banner-greeting">
            <Heart size={16} fill="currentColor" style={{ display: "inline", marginLeft: 7, opacity: 0.85 }} />
            هذا ما يحتاجه الناس منك اليوم
          </div>
          <div className="mission-banner-sub">
            <span className="mission-banner-stat">
              <span className="mission-banner-num">{live.pendingRequests}</span>
              طلب ينتظر مراجعتك
            </span>
            <span className="mission-banner-divider" />
            <span className="mission-banner-stat">
              <span className="mission-banner-num">{live.totalProjects}</span>
              مشروع جارٍ يحتاج متابعتك
            </span>
            <span className="mission-banner-divider" />
            <span className="mission-banner-stat">
              <span className="mission-banner-num">{live.totalUsers}</span>
              مستخدم مسجّل
            </span>
          </div>
        </div>
        <div className="mission-banner-date">
          <Calendar size={13} />
          <span>{today}</span>
        </div>
      </motion.div>

      {/* ── 2. Alert System ───────────────────────────────────── */}
      {ALERTS.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {ALERTS.map((alert, i) => {
            const Icon = alert.icon;
            return (
              <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" animate="show"
                className={`alert-item alert-item--${alert.level}`}
              >
                <div className="alert-icon"><Icon size={16} strokeWidth={2.5} /></div>
                <div className="alert-body">
                  <span className="alert-title">{alert.title}</span>
                  <span className="alert-desc">{alert.desc}</span>
                </div>
                <button onClick={() => navigate(alert.to)} className="alert-action">
                  {alert.action} <ArrowUpRight size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 3. Quick Actions ──────────────────────────────────── */}
      <div className="quick-actions-bar" style={{ marginBottom: 26 }}>
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.button key={i} custom={i + 3} variants={fadeUp} initial="hidden" animate="show"
              onClick={() => navigate(a.to)} className="action-btn"
              style={{ "--btn-color": a.color, "--btn-bg": a.bg, "--btn-border": a.border }}
            >
              <span className="action-btn-icon"><Icon size={15} strokeWidth={2.2} /></span>
              {a.label}
              {a.badge != null && a.badge > 0 && <span className="action-btn-badge">{a.badge}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* ── 4. Stats Grid ─────────────────────────────────────── */}
      <div className="section-label" style={{ marginBottom: 14 }}>
        <TrendingUp size={13} /> مؤشرات الأثر
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {STATS_CONFIG.map((s, i) => (
          <motion.div key={i} custom={i + 4} variants={fadeUp} initial="hidden" animate="show">
            <StatCard {...s} onClick={() => navigate(s.to)} />
          </motion.div>
        ))}
      </div>

      {/* ── 5. Charts ─────────────────────────────────────────── */}
      <div className="section-label" style={{ marginBottom: 14 }}>
        <BarChart3 size={13} /> تحليل الأثر
      </div>
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: 24 }}>
        <Card>
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 15 }}>التبرعات الشهرية</span>
            <span className="card-header-badge">{new Date().getFullYear()}</span>
          </div>
          {live.monthlyDonations.length > 0 ? (
            <>
              {bestMonth && (
                <div className="chart-insight">
                  <TrendingUp size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
                  أعلى شهر: <strong style={{ color: "#1A2535" }}>{bestMonth.m}</strong> — ${bestMonth.v.toLocaleString()}
                </div>
              )}
              <div style={{ padding: "4px 12px 16px" }}>
                <ResponsiveContainer width="100%" height={175}>
                  <BarChart data={live.monthlyDonations} barSize={17} margin={{ top: 0, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E3" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#9AA5B5", fontFamily: "Tajawal" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#9AA5B5" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(37,99,235,0.06)", radius: 4 }} />
                    <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                      {live.monthlyDonations.map((entry, i) => (
                        <Cell key={i} fill={bestMonth && entry.m === bestMonth.m ? "#16A34A" : i === live.monthlyDonations.length - 1 ? "#2563eb" : "#bfdbfe"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 13 }}>
              لا توجد تبرعات مسجّلة هذا العام بعد
            </div>
          )}
        </Card>

        <Card>
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 15 }}>توزيع الطلبات</span>
          </div>
          {live.requestsByType.length > 0 ? (
            <>
              <div className="chart-insight">
                <AlertCircle size={13} style={{ color: "#D97706", flexShrink: 0 }} />
                {live.requestsByType[0]?.type} — الأعلى تكراراً
              </div>
              <div style={{ padding: "2px 8px 12px" }}>
                <ResponsiveContainer width="100%" height={175}>
                  <PieChart>
                    <Pie data={live.requestsByType} dataKey="count" nameKey="type" cx="50%" cy="44%" innerRadius={44} outerRadius={66} paddingAngle={3}>
                      {live.requestsByType.map((item, i) => <Cell key={i} fill={item.color} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: "#5C6B7F", fontFamily: "Tajawal" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8", fontSize: 13 }}>
              لا توجد طلبات بعد
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── 6. Recent Activity ────────────────────────────────── */}
      <div className="section-label" style={{ marginBottom: 14 }}>
        <Calendar size={13} /> آخر النشاطات
      </div>
      <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
      >
        <Card>
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}>
              <ClipboardList size={15} strokeWidth={2} style={{ color: "#2563eb" }} />
              الطلبات الحديثة
            </span>
            <button onClick={() => navigate("/admin/dashboard/requests")} className="card-header-link">
              عرض الكل <ArrowUpRight size={12} />
            </button>
          </div>
          <div style={{ padding: "8px 16px 14px", display: "grid", gap: 2 }}>
            {live.recentRequests.length > 0 ? live.recentRequests.map((r) => (
              <div key={r.id} className="recent-row">
                <div className="recent-avatar" style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                  {(r.name?.[0] || "؟")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "#9AA5B5" }}>{r.type}</div>
                </div>
                <Badge status={r.status} />
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#94A3B8", fontSize: 13 }}>لا توجد طلبات حتى الآن</div>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}>
              <DollarSign size={15} strokeWidth={2} style={{ color: "#16A34A" }} />
              أحدث التبرعات
            </span>
            <button onClick={() => navigate("/admin/dashboard/donations")} className="card-header-link">
              عرض الكل <ArrowUpRight size={12} />
            </button>
          </div>
          <div style={{ padding: "8px 16px 14px", display: "grid", gap: 2 }}>
            {live.recentDonations.length > 0 ? live.recentDonations.map((d) => (
              <div key={d.id} className="recent-row">
                <div className="recent-avatar" style={{ background: "linear-gradient(135deg, #16A34A, #22C55E)" }}>
                  {(d.donor?.[0] || "م")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{d.donor}</div>
                  <div style={{ fontSize: 11, color: "#9AA5B5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.project}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A", flexShrink: 0 }}>
                  ${Number(d.amount).toLocaleString()}
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#94A3B8", fontSize: 13 }}>لا توجد تبرعات حتى الآن</div>
            )}
          </div>
        </Card>
      </motion.div>

    </DashboardLayout>
  );
}

export default OverviewPage;
