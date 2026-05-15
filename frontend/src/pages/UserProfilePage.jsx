import { useState, useEffect } from "react";
import { User, Edit3, Save, X, Heart, HelpCircle, FolderOpen, DollarSign, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppAuth } from "../contexts/AppAuthContext";
import { getUserProfile, updateUserProfile, getUserActivity } from "../services/api";

const HELP_TYPE_AR = {
  medical: "طبية", education: "تعليمية", food: "غذائية",
  housing: "سكنية", financial: "مالية", other: "أخرى",
};

const STATUS_CONFIG = {
  pending:  { label: "قيد المراجعة", color: "#B45309", bg: "#FEF3C7" },
  accepted: { label: "مقبول",        color: "#15803D", bg: "#DCFCE7" },
  rejected: { label: "مرفوض",        color: "#DC2626", bg: "#FEE2E2" },
  completed:{ label: "مكتمل",        color: "#1D4ED8", bg: "#DBEAFE" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#64748B", bg: "#F1F5F9" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1E293B" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748B" }}>{label}</div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const { user, isLoaded } = useAppAuth();

  const [profile, setProfile]   = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({});
  const [saveMsg, setSaveMsg]   = useState("");
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { setLoading(false); return; }

    Promise.all([
      getUserProfile(),
      getUserActivity(),
    ])
      .then(([prof, act]) => {
        setProfile(prof);
        setActivity(act);
        setForm({
          name:  prof.name  || "",
          phone: prof.phone || "",
          city:  prof.city  || "",
          bio:   prof.bio   || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoaded, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateUserProfile(form);
      setProfile(updated);
      setEditing(false);
      setSaveMsg("تم حفظ التغييرات بنجاح");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("تعذر الحفظ، حاول مجدداً");
      setTimeout(() => setSaveMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", gap: 10 }}>
          <Loader2 size={20} className="spin" /> جاري التحميل...
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#64748B" }}>
          <User size={48} color="#CBD5E1" />
          <p style={{ fontSize: 18, fontWeight: 600 }}>يجب تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
        <Footer />
      </>
    );
  }

  const stats = activity?.stats || { totalRequests: 0, totalDonations: 0, totalProjects: 0, donationAmount: 0 };
  const helpRequests = activity?.helpRequests || [];
  const donations    = activity?.donations    || [];
  const avatar = profile?.avatar || "";
  const initials = (profile?.name || user.fullName || "م")[0];

  return (
    <>
      <Navbar />

      <main dir="rtl" style={{ minHeight: "100vh", background: "#F8FAFC", paddingBottom: 60 }}>
        {/* Cover + Avatar */}
        <div style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0E7490 100%)", height: 180, position: "relative" }}>
          <div style={{ position: "absolute", bottom: -48, right: 40, display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", border: "4px solid #fff", background: avatar ? "transparent" : "linear-gradient(135deg, #0E7490, #1E3A5F)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>{initials}</span>}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 20px 0" }}>
          {/* Name + edit button */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>
                {profile?.name || user.fullName || "مستخدم"}
              </h1>
              <p style={{ color: "#64748B", fontSize: 13, margin: "4px 0 0" }}>
                {profile?.email || user.primaryEmailAddress?.emailAddress || ""}
              </p>
              {profile?.bio && (
                <p style={{ color: "#475569", fontSize: 13, marginTop: 6, maxWidth: 500 }}>{profile.bio}</p>
              )}
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#0E7490", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
              >
                <Edit3 size={14} /> تعديل الملف
              </button>
            )}
          </div>

          {saveMsg && (
            <div style={{ background: saveMsg.includes("نجاح") ? "#F0FDF4" : "#FFF1F2", color: saveMsg.includes("نجاح") ? "#16A34A" : "#BE123C", border: `1px solid ${saveMsg.includes("نجاح") ? "#BBF7D0" : "#FECDD3"}`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
              {saveMsg}
            </div>
          )}

          {/* Edit form */}
          {editing && (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#1E293B" }}>تعديل البيانات الشخصية</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { key: "name",  label: "الاسم الكامل",        type: "text" },
                  { key: "phone", label: "رقم الهاتف",           type: "tel" },
                  { key: "city",  label: "المدينة",               type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>
                    <input
                      type={type}
                      value={form[key] || ""}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: 12, color: "#64748B", display: "block", marginBottom: 4, fontWeight: 600 }}>نبذة شخصية</label>
                  <textarea
                    rows={3}
                    value={form.bio || ""}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "#0E7490", color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 13, opacity: saving ? 0.7 : 1 }}>
                  {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />} حفظ
                </button>
                <button onClick={() => setEditing(false)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 10, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  <X size={14} /> إلغاء
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
            <StatCard icon={HelpCircle}  label="طلبات المساعدة"  value={stats.totalRequests}  color="#0E7490" />
            <StatCard icon={Heart}       label="التبرعات"         value={stats.totalDonations}  color="#DC2626" />
            <StatCard icon={FolderOpen}  label="مشاريع مدعومة"   value={stats.totalProjects}   color="#7C3AED" />
            <StatCard icon={DollarSign}  label="إجمالي التبرعات" value={`$${stats.donationAmount.toLocaleString()}`} color="#16A34A" />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #E2E8F0", paddingBottom: 0 }}>
            {[
              { key: "requests",  label: "طلبات المساعدة" },
              { key: "donations", label: "التبرعات" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{ background: "none", border: "none", padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, color: activeTab === key ? "#0E7490" : "#64748B", borderBottom: activeTab === key ? "2px solid #0E7490" : "2px solid transparent", marginBottom: -2, transition: "all .15s" }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "requests" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {helpRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
                  لم تقدم أي طلب مساعدة بعد
                </div>
              ) : (
                helpRequests.map((r) => (
                  <div key={r._id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>
                        {HELP_TYPE_AR[r.helpType] || r.helpType} — {r.city}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
                        {new Date(r.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "donations" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {donations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
                  لم تقم بأي تبرع بعد
                </div>
              ) : (
                donations.map((d) => (
                  <div key={d._id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>
                        {d.projectId?.title || "مشروع غير محدد"}
                      </div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
                        {new Date(d.createdAt).toLocaleDateString("ar-SA")}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "#16A34A", fontSize: 16 }}>
                      ${(d.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
