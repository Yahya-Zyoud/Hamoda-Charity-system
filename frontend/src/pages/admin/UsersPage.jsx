import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Badge from "../../components/admin/Badge";
import Btn from "../../components/admin/Btn";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import Modal from "../../components/admin/Modal";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import { getUsers, adminUpdateUserRole, adminUpdateUserStatus } from "../../services/api";

const normalize = (u) => ({
  id:     u.id,
  name:   u.name     || "—",
  email:  u.email    || "—",
  role:   u.role === "admin" ? "admin" : "user",
  joined: u.joinDate || (u.createdAt ? new Date(u.createdAt).toLocaleDateString("ar-SA") : "—"),
  status: u.status   || "active",
});

function UsersPage() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);
  const [search,   setSearch]   = useState("");
  const [showAdd,  setShowAdd]  = useState(false);
  const [form,     setForm]     = useState({ name: "", email: "", role: "user" });

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data.map(normalize)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const updateRole = async (id, role) => {
    try {
      await adminUpdateUserRole(id, role);
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch {
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, role } : u))); // optimistic
    }
  };

  const toggleStatus = async (id) => {
    const next = users.find((u) => u.id === id)?.status === "active" ? "inactive" : "active";
    try {
      await adminUpdateUserStatus(id, next);
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, status: next } : u)));
    } catch {
      setUsers((p) => p.map((u) => (u.id === id ? { ...u, status: next } : u))); // optimistic
    }
  };

  // Add user is local-only — no backend for creating users outside Clerk
  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((p) => [
      ...p,
      { ...form, id: `local-${Date.now()}`, joined: new Date().toLocaleDateString("ar-SA"), status: "active" },
    ]);
    setShowAdd(false);
    setForm({ name: "", email: "", role: "user" });
  };

  const filtered = users.filter((u) => u.name.includes(search) || u.email.includes(search));

  return (
    <DashboardLayout title="إدارة المستخدمين">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <Btn variant="primary" onClick={() => setShowAdd(true)}>+ إضافة مشرف</Btn>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل المستخدمين: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <>
          <Card style={{ padding: "14px 16px", marginBottom: 16 }}>
            <Input
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Card>

          <Card style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th>المستخدم</Th>
                    <Th>البريد</Th>
                    <Th>الدور</Th>
                    <Th>تاريخ الانضمام</Th>
                    <Th>الحالة</Th>
                    <Th>الإجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: u.role === "admin" ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "#64748B",
                            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 14, flexShrink: 0,
                          }}>
                            {(u.name[0] || "م")}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8" }}>{String(u.id).slice(-8)}</div>
                          </div>
                        </div>
                      </Td>
                      <Td style={{ direction: "ltr", fontSize: 13 }}>{u.email}</Td>
                      <Td><Badge status={u.role} /></Td>
                      <Td style={{ fontSize: 13, color: "#64748B" }}>{u.joined}</Td>
                      <Td><Badge status={u.status} /></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <Btn sm variant="outline" onClick={() => toggleStatus(u.id)}>تغيير الحالة</Btn>
                          {u.role !== "admin" && (
                            <Btn sm variant="info-light" onClick={() => updateRole(u.id, "admin")}>ترقية لمشرف</Btn>
                          )}
                          {u.role !== "user" && (
                            <Btn sm variant="warning-light" onClick={() => updateRole(u.id, "user")}>إلغاء الإشراف</Btn>
                          )}
                        </div>
                      </Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8" }}>
                  {users.length === 0 ? "لا يوجد مستخدمون مسجلون بعد" : "لا توجد نتائج"}
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {showAdd && (
        <Modal title="إضافة مستخدم جديد" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الاسم الكامل *</label>
              <Input placeholder="أدخل الاسم" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>البريد الإلكتروني *</label>
              <Input placeholder="example@mail.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#64748B", display: "block", marginBottom: 6, fontWeight: 600 }}>الدور</label>
              <Select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} style={{ width: "100%" }}>
                <option value="user">مستخدم</option>
                <option value="admin">مشرف</option>
              </Select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn variant="primary" onClick={addUser}>إضافة</Btn>
              <Btn variant="outline" onClick={() => setShowAdd(false)}>إلغاء</Btn>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default UsersPage;
