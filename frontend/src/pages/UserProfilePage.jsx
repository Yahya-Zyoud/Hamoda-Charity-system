import { useState } from "react";
import { motion } from "framer-motion";
import { useAppAuth } from "../contexts/AppAuthContext";
import { User, Mail, Phone, MapPin, LogOut, HeartHandshake, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfilePage() {
  const { user, isAdmin, signOut, isLoaded } = useAppAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.fullName || user?.name || "مستخدم",
    email: user?.primaryEmailAddress?.emailAddress || user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    bio: user?.bio || "",
  });
  const [saved, setSaved] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    // In a real system this would call PUT /api/user/profile
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = form.name || "مستخدم";
  const initial = displayName[0] || "م";

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[Cairo,sans-serif] py-14 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-blue-600 relative">
            {isAdmin && (
              <span className="absolute top-4 left-4 flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                <Shield className="w-3 h-3" /> مشرف
              </span>
            )}
          </div>

          {/* Avatar & Name */}
          <div className="px-8 pb-8 -mt-12">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4">
              {initial}
            </div>
            <h1 className="text-2xl font-black text-slate-900">{displayName}</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              {isAdmin ? "مشرف في جمعية حمودة الخيرية" : "متبرع / داعم"}
            </p>

            {saved && (
              <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-semibold">
                ✓ تم حفظ التغييرات بنجاح
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">المعلومات الشخصية</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-lg transition hover:bg-emerald-50"
              >
                تعديل
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <Field label="الاسم الكامل" icon={User}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </Field>
              <Field label="رقم الهاتف" icon={Phone}>
                <input
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </Field>
              <Field label="المدينة" icon={MapPin}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </Field>
              <Field label="نبذة عني" icon={null}>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition resize-none"
                />
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
                  حفظ التغييرات
                </button>
                <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition">
                  إلغاء
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <InfoRow icon={User} label="الاسم" value={form.name} />
              <InfoRow icon={Mail} label="البريد الإلكتروني" value={form.email} dir="ltr" />
              <InfoRow icon={Phone} label="الهاتف" value={form.phone || "—"} dir="ltr" />
              <InfoRow icon={MapPin} label="المدينة" value={form.city || "—"} />
              {form.bio && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">نبذة</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{form.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
              >
                <Shield className="w-4 h-4" /> لوحة الإدارة
              </button>
            )}
            <button
              onClick={() => navigate("/help")}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm hover:bg-emerald-100 transition"
            >
              <HeartHandshake className="w-4 h-4" /> طلب مساعدة
            </button>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition mr-auto"
            >
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />} {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, dir }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 font-semibold">{label}</p>
        <p className="text-sm text-slate-800 font-medium" dir={dir}>{value}</p>
      </div>
    </div>
  );
}
