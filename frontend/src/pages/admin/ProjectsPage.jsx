import { useState } from "react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import Badge from "../../components/admin/Badge";
import Modal from "../../components/admin/Modal";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import { PROJECTS_DATA } from "../../data/mockAdminData";

function ProjectsPage() {
  const [list, setList] = useState(PROJECTS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { title: "", category: "", description: "", target: "", status: "active" };
  const [form, setForm] = useState(empty);

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setList((p) => p.map((pr) => (pr.id === editing ? { ...pr, ...form, target: +form.target } : pr)));
    } else {
      setList((p) => [...p, { ...form, id: `PRJ-${Date.now()}`, collected: 0, target: +form.target }]);
    }
    setShowForm(false);
    setEditing(null);
    setForm(empty);
  };

  const del = (id) => setList((p) => p.filter((pr) => pr.id !== id));
  const complete = (id) => setList((p) => p.map((pr) => (pr.id === id ? { ...pr, status: "completed" } : pr)));
  const openEdit = (pr) => {
    setEditing(pr.id);
    setForm({ title: pr.title, category: pr.category, description: pr.description, target: pr.target, status: pr.status });
    setShowForm(true);
  };

  const CAT_COLORS = { تعليم: "#0891B2", طبي: "#16A34A", إسكان: "#D97706", غذاء: "#0E7490" };

  return (
    <DashboardLayout title="إدارة المشاريع">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <Btn variant="primary" onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }}>+ إضافة مشروع</Btn>
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
        {list.map((pr) => {
          const pct = Math.min(100, Math.round((pr.collected / pr.target) * 100));
          const barColor = pct >= 100 ? "#16A34A" : pct > 60 ? "#0891B2" : "#D97706";

          return (
            <Card key={pr.id} className="hover-lift" style={{ overflow: "hidden" }}>
              <div style={{ padding: "16px 18px 12px" }}>
                {/* Title & Badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{pr.title}</div>
                    <span style={{
                      background: (CAT_COLORS[pr.category] || "#94A3B8") + "18",
                      color: CAT_COLORS[pr.category] || "#94A3B8",
                      padding: "3px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      border: `1px solid ${(CAT_COLORS[pr.category] || "#94A3B8")}30`,
                    }}>
                      {pr.category}
                    </span>
                  </div>
                  <Badge status={pr.status} />
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.7 }}>{pr.description}</p>

                {/* Progress */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B", marginBottom: 5 }}>
                    <span>${pr.collected.toLocaleString()}</span>
                    <span style={{ fontWeight: 700, color: barColor }}>{pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>

                {/* Footer info */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94A3B8", marginTop: 8 }}>
                  <span>الهدف: ${pr.target.toLocaleString()}</span>
                  <span>#{pr.id}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ borderTop: "1px solid #F1F5F9", padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Btn sm variant="ghost" onClick={() => openEdit(pr)}>✏️ تعديل</Btn>
                {pr.status !== "completed" && <Btn sm variant="success-light" onClick={() => complete(pr.id)}>✔ مكتمل</Btn>}
                <Btn sm variant="danger-light" onClick={() => del(pr.id)}>🗑 حذف</Btn>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <Modal title={editing ? "تعديل المشروع" : "إضافة مشروع جديد"} onClose={() => { setShowForm(false); setEditing(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>عنوان المشروع *</label>
              <Input placeholder="أدخل عنوان المشروع" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>التصنيف</label>
              <Select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} style={{ width: "100%" }}>
                <option value="">اختر تصنيفاً</option>
                {["تعليم", "طبي", "إسكان", "غذاء"].map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الوصف</label>
              <Input placeholder="وصف قصير للمشروع" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>المبلغ المستهدف ($)</label>
              <Input placeholder="0" value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn variant="primary" onClick={save}>{editing ? "حفظ التعديلات" : "إضافة المشروع"}</Btn>
              <Btn variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default ProjectsPage;