// Admin projects management: card grid with create, edit, mark-complete, and delete via modal form.
import { useState, useEffect } from "react";
import { Pencil, Check, Trash2, Loader2 } from "lucide-react";
import { useToast, ToastContainer } from "../../components/Toast";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import Badge from "../../components/admin/Badge";
import Modal from "../../components/admin/Modal";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import { getProjects, createProject, updateProject, deleteProject } from "../../services/api";

// DB uses Arabic status & goal/raised field names — normalize at the boundary
const DB_STATUS = { active: "نشط", completed: "مكتمل" };
const UI_STATUS = { "نشط": "active", "مكتمل": "completed", "معلق": "active" };

const dbToUi = (p) => ({
  id:          p.id,
  title:       p.title       || "",
  category:    p.category    || "",
  description: p.description || "",
  target:      p.goal        || 0,
  collected:   p.raised      || 0,
  status:      UI_STATUS[p.status] || "active",
});

const uiToDb = (form) => ({
  title:       form.title,
  category:    form.category,
  description: form.description,
  goal:        parseFloat(String(form.target).replace(/[^\d.]/g, "")) || 0,
  status:      DB_STATUS[form.status] || "نشط",
});

const CATEGORIES = ["صحة", "تعليم", "إغاثة", "بنية تحتية", "دعم نفسي", "غذاء", "مياه", "رعاية", "أضاحي", "إسكان", "أخرى"];
const CAT_COLORS = { تعليم: "#2563eb", صحة: "#16A34A", إسكان: "#D97706", غذاء: "#8b5cf6", إغاثة: "#DC2626", مياه: "#0EA5E9", رعاية: "#F59E0B", أضاحي: "#7C3AED" };
const empty = { title: "", category: "", description: "", target: "", status: "active" };

function ProjectsPage() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(empty);
  const [saveError,  setSaveError]  = useState("");
  const { toasts, addToast, remove: removeToast } = useToast();

  useEffect(() => {
    getProjects()
      .then((data) => setList(data.map(dbToUi)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaveError("");
    try {
      if (editing) {
        const updated = await updateProject(editing, uiToDb(form));
        setList((p) => p.map((pr) => (pr.id === editing ? dbToUi(updated) : pr)));
      } else {
        const created = await createProject(uiToDb(form));
        setList((p) => [...p, dbToUi(created)]);
      }
      closeForm();
    } catch (err) {
      setSaveError(err?.message || "حدث خطأ أثناء الحفظ، حاول مجدداً");
    }
  };

  const del = async (id) => {
    try {
      await deleteProject(id);
      setList((p) => p.filter((pr) => pr.id !== id));
      addToast("تم حذف المشروع بنجاح", "success");
    } catch (err) {
      addToast(err?.message || "تعذّر حذف المشروع", "error");
    }
  };

  const complete = async (id) => {
    try {
      await updateProject(id, { status: "مكتمل" });
      setList((p) => p.map((pr) => (pr.id === id ? { ...pr, status: "completed" } : pr)));
      addToast("تم تعيين المشروع كمكتمل", "success");
    } catch (err) {
      addToast(err?.message || "تعذّر تحديث المشروع", "error");
    }
  };

  const openEdit = (pr) => {
    setEditing(pr.id);
    setForm({ title: pr.title, category: pr.category, description: pr.description, target: pr.target, status: pr.status });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); setSaveError(""); };

  return (
    <DashboardLayout title="إدارة المشاريع">
      <ToastContainer toasts={toasts} remove={removeToast} />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <Btn variant="primary" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>+ إضافة مشروع</Btn>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل المشاريع: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          {list.map((pr) => {
            const pct = pr.target > 0 ? Math.min(100, Math.round((pr.collected / pr.target) * 100)) : 0;
            const barColor = pct >= 100 ? "#16A34A" : pct > 60 ? "#2563eb" : "#D97706";

            return (
              <Card key={pr.id} className="hover-lift" style={{ overflow: "hidden" }}>
                <div style={{ padding: "16px 18px 12px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{pr.title}</div>
                      <span style={{
                        background: (CAT_COLORS[pr.category] || "#94A3B8") + "18",
                        color: CAT_COLORS[pr.category] || "#94A3B8",
                        padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                        border: `1px solid ${(CAT_COLORS[pr.category] || "#94A3B8")}30`,
                      }}>
                        {pr.category || "—"}
                      </span>
                    </div>
                    <Badge status={pr.status} />
                  </div>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.7 }}>{pr.description}</p>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 5 }}>
                      <span>${pr.collected.toLocaleString()}</span>
                      <span style={{ fontWeight: 700, color: barColor }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94A3B8", marginTop: 8 }}>
                    <span>الهدف: ${pr.target.toLocaleString()}</span>
                    <span>#{String(pr.id).slice(-6)}</span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #F1F5F9", padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Btn sm variant="ghost" onClick={() => openEdit(pr)}><Pencil size={13} style={{ marginLeft: 4 }} /> تعديل</Btn>
                  {pr.status !== "completed" && (
                    <Btn sm variant="success-light" onClick={() => complete(pr.id)}><Check size={13} style={{ marginLeft: 4 }} /> مكتمل</Btn>
                  )}
                  <Btn sm variant="danger-light" onClick={() => del(pr.id)}><Trash2 size={13} style={{ marginLeft: 4 }} /> حذف</Btn>
                </div>
              </Card>
            );
          })}
          {list.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>لا توجد مشاريع حتى الآن</div>
          )}
        </div>
      )}

      {showForm && (
        <Modal title={editing ? "تعديل المشروع" : "إضافة مشروع جديد"} onClose={closeForm}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>عنوان المشروع *</label>
              <Input placeholder="أدخل عنوان المشروع" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>التصنيف</label>
              <Select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} style={{ width: "100%" }}>
                <option value="">اختر تصنيفاً</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الوصف</label>
              <Input placeholder="وصف قصير للمشروع" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>المبلغ المستهدف ($)</label>
              <Input type="number" min="0" placeholder="0" value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} />
            </div>
            {saveError && (
              <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>
                {saveError}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn variant="primary" onClick={save}>{editing ? "حفظ التعديلات" : "إضافة المشروع"}</Btn>
              <Btn variant="outline" onClick={closeForm}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default ProjectsPage;
