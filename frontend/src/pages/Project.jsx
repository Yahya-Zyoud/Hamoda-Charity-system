import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import Navbar       from "../Components/Navbar";
import Footer       from "../Components/Footer";

import ProjectHero    from "../Components/ProjectComp/ProjectHero";
import ProjectStats   from "../Components/ProjectComp/ProjectStats";
import ProjectFilters from "../Components/ProjectComp/ProjectFilters";
import ProjectGrid    from "../Components/ProjectComp/ProjectGrid";
import ProjectCTA     from "../Components/ProjectComp/ProjectCTA";
import * as api       from "../services/api";

// ── بيانات تجريبية تُستخدم إذا فشل الاتصال بالباكند ──────
const DEMO_PROJECTS = [
  {
    _id: "1",
    title: "بناء مركز صحي متكامل",
    category: "صحة",
    status: "نشط",
    description: "إنشاء مركز صحي شامل مجهز بأحدث المعدات الطبية لخدمة 10,000 مواطن في المناطق النائية.",
    goal: 100000, raised: 45000, beneficiaries: 10000,
    location: "منطقة القصيم", startDate: "2025-03-01",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
  {
    _id: "2",
    title: "برنامج التعليم المجاني",
    category: "تعليم",
    status: "نشط",
    description: "توفير التعليم المجاني والدعم الأكاديمي لـ 500 طالب من الأسر المحتاجة في جميع المراحل الدراسية.",
    goal: 80000, raised: 60000, beneficiaries: 500,
    location: "الرياض، جدة، الدمام", startDate: "2025-01-01",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  },
  {
    _id: "3",
    title: "توزيع السلال الغذائية",
    category: "إغاثة",
    status: "مكتمل",
    description: "توزيع سلال غذائية شهرية متكاملة تحتوي على المواد الأساسية على 300 أسرة محتاجة.",
    goal: 30000, raised: 30000, beneficiaries: 300,
    location: "جميع المناطق", startDate: "2024-11-01",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  },
  {
    _id: "4",
    title: "برنامج التدريب المهني",
    category: "تدريب",
    status: "مكتمل",
    description: "تدريب الشباب على المهارات العملية لتمكينهم من سوق العمل وتحقيق الاكتفاء الذاتي.",
    goal: 40000, raised: 40000, beneficiaries: 200,
    location: "نابلس", startDate: "2024-09-01",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  {
    _id: "5",
    title: "رعاية أطفال ذوي الاحتياجات",
    category: "رعاية",
    status: "نشط",
    description: "تقديم الرعاية الشاملة والدعم اللازم للأطفال ذوي الاحتياجات الخاصة وأسرهم.",
    goal: 55000, raised: 22000, beneficiaries: 150,
    location: "فلسطين", startDate: "2024-01-01",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
  },
  {
    _id: "6",
    title: "إعادة إعمار المنازل",
    category: "إسكان",
    status: "نشط",
    description: "إعادة بناء وترميم المنازل المتضررة لتوفير مأوى آمن وكريم للعائلات المحتاجة.",
    goal: 120000, raised: 75000, beneficiaries: 80,
    location: "نابلس وضواحيها", startDate: "2024-01-01",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
];

const initialProjectForm = {
  title: "",
  category: "صحة",
  status: "نشط",
  description: "",
  goal: 0,
  raised: 0,
  beneficiaries: 0,
  location: "",
  startDate: "",
  image: "",
};

export default function Projects() {
  const [projects,       setProjects]       = useState([]);
  const [stats,          setStats]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [category,       setCategory]       = useState("الكل");
  const [status,         setStatus]         = useState("الكل");
  const [formData,       setFormData]       = useState(initialProjectForm);
  const [formError,      setFormError]      = useState(null);
  const [pageError,      setPageError]      = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm,       setShowForm]       = useState(false);
  const [saving,         setSaving]         = useState(false);

  
  const loadProjects = async () => {
    try {
      setLoading(true);
      setPageError(null);
      const [projectsData, statsData] = await Promise.all([
        api.getProjects(),
        api.getProjectStats(),
      ]);

      setProjects(Array.isArray(projectsData) && projectsData.length ? projectsData : DEMO_PROJECTS);
      setStats(statsData);
    } catch (err) {
      setProjects(DEMO_PROJECTS);
      setPageError(err.message || "لا يمكن جلب بيانات المشاريع من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  const openForm = (project = null) => {
    setSelectedProject(project);
    setFormData(project ? { ...project } : initialProjectForm);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setSelectedProject(null);
    setFormData(initialProjectForm);
    setFormError(null);
    setShowForm(false);
  };

  const handleFormChange = (event) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setFormError(null);

      const payload = {
        title:         formData.title,
        category:      formData.category,
        status:        formData.status,
        description:   formData.description,
        goal:          Number(formData.goal) || 0,
        raised:        Number(formData.raised) || 0,
        beneficiaries: Number(formData.beneficiaries) || 0,
        location:      formData.location,
        startDate:     formData.startDate,
        image:         formData.image,
      };

      if (selectedProject) {
        const updated = await api.updateProject(selectedProject._id, payload);
        setProjects((prev) => prev.map((project) => (project._id === updated._id ? updated : project)));
      } else {
        const created = await api.createProject(payload);
        setProjects((prev) => [created, ...prev]);
      }

      closeForm();
    } catch (err) {
      setFormError(err.message || "فشل حفظ المشروع، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    openForm(project);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`هل أنت متأكد من حذف المشروع: ${project.title}؟`)) return;
    try {
      setLoading(true);
      await api.deleteProject(project._id);
      setProjects((prev) => prev.filter((item) => item._id !== project._id));
    } catch (err) {
      setPageError(err.message || "فشل حذف المشروع.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  
  const computedStats = stats || {
    total:         projects.length,
    active:        projects.filter((p) => p.status === "نشط").length,
    done:          projects.filter((p) => p.status === "مكتمل").length,
    beneficiaries: projects.reduce((s, p) => s + (p.beneficiaries || 0), 0),
  };

  // ── الفلترة ─────────────────────────────────────────────
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    const matchCat    = category === "الكل" || p.category === category;
    const matchStatus = status   === "الكل" || p.status   === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f0f9ff" }}>

      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <ProjectHero />

        {/* Stats */}
        <ProjectStats stats={computedStats} />

        <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ProjectFilters
              search={search}     setSearch={setSearch}
              category={category} setCategory={setCategory}
              status={status}     setStatus={setStatus}
              total={projects.length}
              filtered={filtered.length}
            />
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
              إضافة مشروع جديد
            </button>
          </div>

          {showForm && (
            <section className="rounded-3xl bg-white p-6 shadow-xl" dir="rtl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>
                    {selectedProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
                  </h2>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {selectedProject ? "حدّث بيانات المشروع ثم احفظ." : "أنشئ مشروعاً جديداً وأضفه لقائمة المشاريع."}
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
                  { label: "العنوان", name: "title", type: "text" },
                  { label: "الفئة", name: "category", type: "text" },
                  { label: "الحالة", name: "status", type: "text" },
                  { label: "الموقع", name: "location", type: "text" },
                  { label: "تاريخ البدء", name: "startDate", type: "date" },
                  { label: "رابط الصورة", name: "image", type: "text" },
                  { label: "الهدف", name: "goal", type: "number" },
                  { label: "المبالغ المجمعة", name: "raised", type: "number" },
                  { label: "عدد المستفيدين", name: "beneficiaries", type: "number" },
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
                    {saving ? "جاري الحفظ..." : selectedProject ? "حفظ التعديلات" : "إضافة مشروع"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {pageError && (
            <div
              className="rounded-2xl bg-red-50 p-5 text-sm text-red-700"
              style={{ border: "1px solid rgba(234,33,67,0.16)" }}
            >
              ⚠️ {pageError}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-24">
            <Loader2 className="animate-spin w-5 h-5" style={{ color: "#1856FF" }} />
            <span className="text-sm" style={{ color: "#64748b" }}>
              جاري تحميل المشاريع...
            </span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <ProjectGrid
            projects={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* CTA */}
        {!loading && <ProjectCTA />}

      </main>

      <Footer />

    </div>
  );
}