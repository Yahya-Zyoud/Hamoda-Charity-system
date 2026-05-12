import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Heart, Clock,
  CheckCircle, Gift, Star, Edit3, Camera,
} from "lucide-react";

const MOCK_USER = {
  name: "أحمد محمد العلي",
  email: "ahmed.ali@example.com",
  phone: "0501234567",
  city: "الرياض",
  joinDate: "يناير 2024",
  avatar: null,
};

const MOCK_STATS = [
  { label: "التبرعات", value: "12", icon: Gift, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "طلبات المساعدة", value: "3", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "المشاريع المدعومة", value: "5", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
];

const MOCK_ACTIVITY = [
  { id: 1, type: "donation", text: "تبرعت لمشروع بناء مسجد", amount: "500 ر.س", date: "منذ 3 أيام", status: "مكتمل" },
  { id: 2, type: "request", text: "طلب مساعدة: دعم عائلة محتاجة", amount: null, date: "منذ أسبوع", status: "قيد المراجعة" },
  { id: 3, type: "donation", text: "تبرعت لمشروع حفر بئر", amount: "1,200 ر.س", date: "منذ أسبوعين", status: "مكتمل" },
  { id: 4, type: "donation", text: "تبرعت في حملة رمضان", amount: "300 ر.س", date: "منذ شهر", status: "مكتمل" },
];

export default function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(MOCK_USER);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initial = form.name?.[0] || "أ";

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4" style={{ fontFamily: "Cairo, sans-serif" }}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ─── Profile Header Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[32px] overflow-hidden"
          style={{
            boxShadow:
              "0 32px 72px -16px rgba(10, 20, 40, 0.45), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* ── Deep layered base gradient ── */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1628] via-[#0f2240] to-[#072518]" />

          {/* ── Floating orb — top-right ── */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/40 to-cyan-400/20 blur-3xl pointer-events-none"
          />

          {/* ── Floating orb — bottom-left ── */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-500/35 to-teal-400/15 blur-3xl pointer-events-none"
          />

          {/* ── Subtle centre glow ── */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent pointer-events-none" />

          {/* ── Dot-grid texture ── */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* ── Top glass sheen line ── */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* ── Content ── */}
          <div className="relative px-8 pt-10 pb-9 flex flex-col sm:flex-row sm:items-center gap-7">

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="relative flex-shrink-0 self-start sm:self-auto group"
            >
              {/* Animated glow ring */}
              <motion.div
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-[3px] rounded-[27px] bg-gradient-to-br from-emerald-400 via-cyan-300 to-blue-500 blur-[4px] group-hover:blur-[7px] transition-all duration-500 pointer-events-none"
              />
              {/* Solid ring */}
              <div className="absolute -inset-[2px] rounded-[25px] bg-gradient-to-br from-emerald-400 via-cyan-300 to-blue-500" />
              {/* Avatar face */}
              <div className="relative w-[88px] h-[88px] rounded-[23px] bg-gradient-to-br from-emerald-400 via-teal-400 to-blue-600 flex items-center justify-center text-white text-4xl font-black select-none shadow-xl">
                {initial}
              </div>
              {/* Camera button */}
              <motion.button
                whileHover={{ scale: 1.25, rotate: 8 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="absolute -bottom-2 -left-2 w-8 h-8 rounded-xl bg-white shadow-xl border border-slate-100/80 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-colors duration-200"
              >
                <Camera className="w-[14px] h-[14px]" />
              </motion.button>
            </motion.div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-[1.75rem] font-black text-white tracking-tight leading-snug"
              >
                {form.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5"
              >
                <span className="flex items-center gap-1.5 text-emerald-300/90 text-sm font-semibold">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {form.city}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-white/20 flex-shrink-0 hidden sm:block" />
                <span className="flex items-center gap-1.5 text-slate-400/90 text-sm font-medium">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  انضم في {MOCK_USER.joinDate}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.38 }}
                className="mt-4"
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white/70 text-xs font-bold backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                  متبرع نشط
                </span>
              </motion.div>
            </div>

            {/* Saved toast */}
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="absolute top-5 left-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-sm font-bold backdrop-blur-md shadow-xl shadow-black/20"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                تم الحفظ بنجاح
              </motion.div>
            )}
          </div>

          {/* ── Bottom glass border ── */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>

        {/* ─── Stats Row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-4"
        >
          {MOCK_STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-2 text-center">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-2xl font-black text-slate-900">{value}</span>
              <span className="text-xs text-slate-500 font-semibold">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ─── Personal Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-sm p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">المعلومات الشخصية</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-sm font-bold text-emerald-600 border border-emerald-200 px-4 py-1.5 rounded-xl hover:bg-emerald-50 transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> تعديل
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              {[
                { key: "name", label: "الاسم الكامل", icon: User, type: "text" },
                { key: "phone", label: "رقم الهاتف", icon: Phone, type: "tel", ltr: true },
                { key: "city", label: "المدينة", icon: MapPin, type: "text" },
              ].map(({ key, label, icon: Icon, type, ltr }) => (
                <div key={key}>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-2">
                    <Icon className="w-4 h-4 text-slate-400" /> {label}
                  </label>
                  <input
                    type={type}
                    dir={ltr ? "ltr" : undefined}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
                  حفظ
                </button>
                <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition">
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-1">
              <InfoRow icon={User} label="الاسم الكامل" value={form.name} />
              <InfoRow icon={Mail} label="البريد الإلكتروني" value={form.email} ltr />
              <InfoRow icon={Phone} label="الهاتف" value={form.phone} ltr />
              <InfoRow icon={MapPin} label="المدينة" value={form.city} />
            </div>
          )}
        </motion.div>

        {/* ─── Recent Activity Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-white rounded-3xl shadow-sm p-8"
        >
          <h2 className="text-lg font-black text-slate-900 mb-6">النشاط الأخير</h2>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === "donation" ? "bg-emerald-100" : "bg-rose-100"}`}>
                  {item.type === "donation"
                    ? <Gift className="w-5 h-5 text-emerald-600" />
                    : <Heart className="w-5 h-5 text-rose-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {item.amount && (
                    <span className="text-sm font-black text-emerald-600">{item.amount}</span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.status === "مكتمل" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-semibold">{label}</p>
        <p className="text-sm text-slate-800 font-semibold" dir={ltr ? "ltr" : undefined}>{value}</p>
      </div>
    </div>
  );
}
