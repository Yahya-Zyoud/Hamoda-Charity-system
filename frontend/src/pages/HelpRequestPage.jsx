import { useState } from "react";
import { motion } from "framer-motion";
import { submitHelpRequest } from "../services/api";
import {
  HeartHandshake, User, Phone, Mail, FileText,
  Paperclip, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";

const REQUEST_TYPES = ["طبي", "إسكان", "تعليم", "غذاء", "عمل", "أخرى"];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  type: "",
  description: "",
  city: "",
  urgency: "normal",
};

export default function HelpRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\s-]{7,15}$/.test(form.phone.trim())) e.phone = "رقم هاتف غير صحيح";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "بريد إلكتروني غير صحيح";
    if (!form.type) e.type = "يرجى اختيار نوع الطلب";
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = "يرجى وصف حالتك بشكل مفصل (20 حرفاً على الأقل)";
    return e;
  };

  const field = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus("loading");
    setServerError("");
    try {
      await submitHelpRequest(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setServerError(err.message || "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-6 font-[Cairo,sans-serif]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-3">تم إرسال طلبك بنجاح</h2>
          <p className="text-slate-600 mb-8">
            سيتواصل معك فريقنا خلال 24-48 ساعة. شكراً لثقتك بنا.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            تقديم طلب آخر
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[Cairo,sans-serif]">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-5">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">طلب مساعدة</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">هل تحتاج إلى مساعدة؟</h1>
          <p className="text-slate-600 text-lg">
            أخبرنا عن حالتك وسيتواصل معك فريقنا في أقرب وقت ممكن.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4" /> الاسم الكامل *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                placeholder="محمد أحمد"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${errors.name ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> رقم الهاتف *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => field("phone", e.target.value)}
                placeholder="0599123456"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${errors.phone ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> البريد الإلكتروني
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
                placeholder="example@mail.com"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${errors.email ? "border-red-400" : "border-slate-200"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">المدينة</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => field("city", e.target.value)}
                placeholder="غزة"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Request Type & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">نوع الطلب *</label>
              <select
                value={form.type}
                onChange={(e) => field("type", e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${errors.type ? "border-red-400" : "border-slate-200"}`}
              >
                <option value="">اختر نوع المساعدة</option>
                {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">درجة الإلحاح</label>
              <select
                value={form.urgency}
                onChange={(e) => field("urgency", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="normal">عادي</option>
                <option value="urgent">عاجل</option>
                <option value="critical">حرج جداً</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> وصف الحالة *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="يرجى وصف حالتك بشكل مفصل حتى نتمكن من مساعدتك بشكل أفضل..."
              rows={5}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition resize-vertical focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${errors.description ? "border-red-400" : "border-slate-200"}`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description
                ? <p className="text-red-500 text-xs">{errors.description}</p>
                : <span />}
              <span className="text-xs text-slate-400">{form.description.length} حرف</span>
            </div>
          </div>

          {/* Server Error */}
          {status === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</>
            ) : (
              <><HeartHandshake className="w-5 h-5" /> إرسال الطلب</>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            جميع المعلومات تُحفظ بشكل آمن وسري تام
          </p>
        </motion.form>
      </div>
    </div>
  );
}
