import { useState, useEffect } from "react";
import Navbar    from "../Components/Navbar";
import Footer    from "../Components/Footer";

import Hero      from "../Components/TeamWorkComp/Hero";
import Stats     from "../Components/TeamWorkComp/Stats";
import SearchBar from "../Components/TeamWorkComp/SearchBar";
import TeamGrid  from "../Components/TeamWorkComp/TeamGrid";
import * as api  from "../services/api";

const DEMO_TEAM = [
  {
    _id: "demo-1",
    name: "د. نورة العلي",
    title: "مديرة البرامج الطبية",
    role: "دكتور",
    description: "قيادة الفريق الطبي وتنسيق حملات العلاج والرعاية الصحية للمحتاجين.",
    email: "noura@example.com",
    phone: "+966500000001",
    initials: "ن الع",
  },
  {
    _id: "demo-2",
    name: "أ. محمد السالم",
    title: "منسق المشاريع",
    role: "إدارة",
    description: "متابعة تنفيذ المشاريع الخيرية وضمان وصول الدعم للمستفيدين بشكل فعال.",
    email: "mohammed@example.com",
    phone: "+966500000002",
    initials: "م س",
  },
  {
    _id: "demo-3",
    name: "فاطمة الشمري",
    title: "متطوعة اجتماعية",
    role: "متطوع",
    description: "تنظيم الفعاليات الجماعية وجمع التبرعات لدعم الأسر المحتاجة.",
    email: "fatima@example.com",
    phone: "+966500000003",
    initials: "ف ش",
  },
  {
    _id: "demo-4",
    name: "أ. سامي الحربي",
    title: "موظف دعم فني",
    role: "موظف",
    description: "دعم القسم التقني وتقوية الأنظمة الرقمية لسهولة التواصل مع المتبرعين.",
    email: "sami@example.com",
    phone: "+966500000004",
    initials: "س ح",
  },
];

const initialForm = {
  name: "",
  title: "",
  role: "موظف",
  description: "",
  email: "",
  phone: "",
  image: "",
  initials: "",
  active: true,
  order: 0,
};

export default function TeamWork() {
  const [team,           setTeam]           = useState(DEMO_TEAM);
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [formData,       setFormData]       = useState(initialForm);
  const [formError,      setFormError]      = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm,       setShowForm]       = useState(false);
  const [saving,         setSaving]         = useState(false);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTeam();
      setTeam(Array.isArray(data) && data.length ? data : DEMO_TEAM);
    } catch (err) {
      setTeam(DEMO_TEAM);
      setError(err.message || "لا يمكن جلب بيانات الفريق من الخادم، يتم عرض بيانات تجريبية.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openForm = (member = null) => {
    setSelectedMember(member);
    setFormData(member ? { ...member } : initialForm);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedMember(null);
    setFormData(initialForm);
    setFormError(null);
    setShowForm(false);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFormError(null);

      const payload = {
        name:        formData.name,
        title:       formData.title,
        role:        formData.role,
        description: formData.description,
        email:       formData.email,
        phone:       formData.phone,
        image:       formData.image,
        initials:    formData.initials,
        active:      Boolean(formData.active),
        order:       Number(formData.order) || 0,
      };

      if (selectedMember) {
        const updated = await api.updateTeamMember(selectedMember._id, payload);
        setTeam((prev) => prev.map((member) => (member._id === updated._id ? updated : member)));
      } else {
        const created = await api.createTeamMember(payload);
        setTeam((prev) => [created, ...prev]);
      }

      closeForm();
    } catch (err) {
      setFormError(err.message || "فشل حفظ العضو، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    openForm(member);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`هل أنت متأكد من حذف ${member.name}؟`)) return;
    try {
      setLoading(true);
      await api.deleteTeamMember(member._id);
      setTeam((prev) => prev.filter((item) => item._id !== member._id));
    } catch (err) {
      setError(err.message || "فشل حذف العضو.");
    } finally {
      setLoading(false);
    }
  };

  // ── تصفية البحث ─────────────────────────────────────────
  const filtered = team.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q)        ||
      m.role?.toLowerCase().includes(q)        ||
      m.title?.toLowerCase().includes(q)       ||
      m.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f0f9ff" }}>

      <Navbar />

      <main className="flex-1">

        <Hero />

        <Stats />

        <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar search={search} setSearch={setSearch} />
            <button
              type="button"
              onClick={() => openForm(null)}
              className="rounded-full px-5 py-3 font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #1856FF, #07CA6B)",
                color: "white",
                border: "none",
                boxShadow: "0 10px 24px rgba(24,86,255,0.2)",
              }}
            >
              إضافة عضو جديد
            </button>
          </div>

          {showForm && (
            <section className="rounded-3xl bg-white p-6 shadow-xl" dir="rtl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>
                    {selectedMember ? "تعديل عضو" : "إضافة عضو جديد"}
                  </h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {selectedMember ? "قم بتحديث بيانات العضو ثم حفظ." : "أضف موظفاً أو متطوعاً جديداً إلى الفريق."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-sm font-semibold"
                  style={{ color: "#475569" }}
                >
                  إغلاق
                </button>
              </div>

              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                {[
                  { label: "الاسم", name: "name", type: "text" },
                  { label: "الوظيفة", name: "title", type: "text" },
                  { label: "المسمى الوظيفي", name: "role", type: "text" },
                  { label: "البريد الإلكتروني", name: "email", type: "email" },
                  { label: "رقم الهاتف", name: "phone", type: "text" },
                  { label: "رابط الصورة", name: "image", type: "text" },
                  { label: "المبادئ", name: "initials", type: "text" },
                  { label: "ترتيب العرض", name: "order", type: "number" },
                ].map(({ label, name, type }) => (
                  <label key={name} className="block text-sm font-medium text-slate-700">
                    {label}
                    <input
                      name={name}
                      type={type}
                      value={formData[name] ?? ""}
                      onChange={handleFormChange}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-300"
                    />
                  </label>
                ))}
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  الوصف
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-300"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={Boolean(formData.active)}
                    onChange={handleFormChange}
                  />
                  عضو نشط
                </label>
                {formError && (
                  <div className="sm:col-span-2 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}
                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "جاري الحفظ..." : selectedMember ? "حفظ التعديلات" : "إضافة عضو"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {error && (
            <div
              className="rounded-2xl bg-red-50 p-5 text-sm text-red-700"
              style={{ border: "1px solid rgba(234,33,67,0.16)" }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-24">
            <svg
              className="animate-spin w-5 h-5"
              style={{ color: "#1856FF" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            <span className="text-sm" style={{ color: "#64748b" }}>
              جاري تحميل بيانات الفريق...
            </span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <TeamGrid
            members={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

      </main>

      <Footer />

    </div>
  );
}