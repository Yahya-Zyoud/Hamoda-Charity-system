import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import Modal from "../../components/admin/Modal";
import Input from "../../components/admin/Input";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import Select from "../../components/admin/Select";
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../services/api";

const ROLES = ["إدارة", "موظف", "دكتور", "متطوع", "سيكيورتي"];

const empty = { name: "", title: "", role: "", description: "", email: "", phone: "", order: 0 };

function UsersPage() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(empty);
  const [saving,   setSaving]   = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getTeam()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const field = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const openAdd  = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (m) => {
    setEditing(m._id || m.id);
    setForm({ name: m.name, title: m.title, role: m.role, description: m.description || "", email: m.email || "", phone: m.phone || "", order: m.order ?? 0 });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); setSaveError(""); };

  const save = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.role.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) {
        const updated = await updateTeamMember(editing, payload);
        setList((p) => p.map((m) => (m._id === editing || m.id === editing) ? updated : m));
      } else {
        const created = await createTeamMember(payload);
        setList((p) => [...p, created]);
      }
      closeForm();
    } catch (err) {
      setSaveError(err?.message || "حدث خطأ أثناء الحفظ، حاول مجدداً");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    try {
      await deleteTeamMember(id);
      setList((p) => p.filter((m) => (m._id || m.id) !== id));
    } catch {}
  };

  const filtered = list.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.title?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q)
    );
  });

  const initials = (m) =>
    m.initials || (m.name ? m.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2) : "؟");

  return (
    <DashboardLayout title="إدارة الفريق">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <Btn variant="primary" onClick={openAdd}>+ إضافة موظف</Btn>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}

      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل الفريق: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <>
          <Card style={{ padding: "14px 16px", marginBottom: 16 }}>
            <Input
              placeholder="بحث بالاسم أو المسمى الوظيفي..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Card>

          <Card style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th>الموظف</Th>
                    <Th>المسمى الوظيفي</Th>
                    <Th>الدور</Th>
                    <Th>البريد الإلكتروني</Th>
                    <Th>الهاتف</Th>
                    <Th>الترتيب</Th>
                    <Th>الإجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const id = m._id || m.id;
                    return (
                      <TableRow key={id}>
                        <Td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: "50%",
                              background: "linear-gradient(135deg,#2563eb,#60a5fa)",
                              color: "#fff", display: "flex", alignItems: "center",
                              justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0,
                            }}>
                              {initials(m)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{m.name}</div>
                              {m.description && (
                                <div style={{ fontSize: 12, color: "#94A3B8", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {m.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Td>
                        <Td style={{ fontWeight: 500 }}>{m.title}</Td>
                        <Td>
                          <span style={{
                            background: "#EFF6FF", color: "#2563eb",
                            borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
                            border: "1px solid #BFDBFE",
                          }}>
                            {m.role}
                          </span>
                        </Td>
                        <Td style={{ direction: "ltr", fontSize: 13, color: "#64748B" }}>{m.email || "—"}</Td>
                        <Td style={{ direction: "ltr", fontSize: 13, color: "#64748B" }}>{m.phone || "—"}</Td>
                        <Td style={{ textAlign: "center", color: "#64748B" }}>{m.order ?? 0}</Td>
                        <Td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Btn sm variant="ghost" onClick={() => openEdit(m)}>
                              <Pencil size={13} style={{ marginLeft: 4 }} /> تعديل
                            </Btn>
                            <Btn sm variant="danger-light" onClick={() => del(id)}>
                              <Trash2 size={13} style={{ marginLeft: 4 }} /> حذف
                            </Btn>
                          </div>
                        </Td>
                      </TableRow>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8" }}>
                  {list.length === 0 ? "لا يوجد موظفون بعد — أضف أول موظف!" : "لا توجد نتائج"}
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {showForm && (
        <Modal title={editing ? "تعديل بيانات الموظف" : "إضافة موظف جديد"} onClose={closeForm}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الاسم الكامل *</label>
                <Input placeholder="أحمد محمد" value={form.name} onChange={field("name")} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>المسمى الوظيفي *</label>
                <Input placeholder="مدير المشاريع" value={form.title} onChange={field("title")} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الدور *</label>
                <Select value={form.role} onChange={field("role")} style={{ width: "100%" }}>
                  <option value="">-- اختر الدور --</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </Select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الترتيب</label>
                <Input type="number" placeholder="0" value={form.order} onChange={field("order")} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>نبذة قصيرة</label>
              <Input placeholder="وصف مختصر عن الموظف" value={form.description} onChange={field("description")} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>البريد الإلكتروني</label>
                <Input placeholder="example@mail.com" value={form.email} onChange={field("email")} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>رقم الهاتف</label>
                <Input placeholder="+966 5x xxx xxxx" value={form.phone} onChange={field("phone")} />
              </div>
            </div>

            {saveError && (
              <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>
                {saveError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn variant="primary" onClick={save} disabled={saving}>
                {saving ? "جاري الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الموظف"}
              </Btn>
              <Btn variant="outline" onClick={closeForm}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default UsersPage;
