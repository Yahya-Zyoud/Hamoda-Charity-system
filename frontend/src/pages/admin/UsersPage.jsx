import { useState } from "react";
import DashboardLayout from "../../Components/admin/DashboardLayout";
import Card from "../../Components/admin/Card";
import Badge from "../../Components/admin/Badge";
import Btn from "../../Components/admin/Btn";
import Input from "../../Components/admin/Input";
import Select from "../../Components/admin/Select";
import Modal from "../../Components/admin/Modal";
import { Th, Td, TableRow } from "../../Components/admin/TableParts";
import { USERS_DATA } from "../../data/mockAdminData";

function UsersPage() {
  const [users, setUsers] = useState(USERS_DATA);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });

  const updateRole = (id, role) =>
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, role } : u)));

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((p) => [
      ...p,
      {
        ...form,
        id: `USR-${Date.now()}`,
        joined: new Date().toISOString().slice(0, 10),
        status: "active",
      },
    ]);
    setShowAdd(false);
    setForm({ name: "", email: "", role: "user" });
  };

  const filtered = users.filter(
    (u) => u.name.includes(search) || u.email.includes(search)
  );

  return (
    <DashboardLayout title="إدارة المستخدمين">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <Btn variant="primary" onClick={() => setShowAdd(true)}>+ إضافة مشرف</Btn>
      </div>

      {/* Search */}
      <Card style={{ padding: "14px 16px", marginBottom: 16 }}>
        <Input
          placeholder="🔍 بحث بالاسم أو البريد الإلكتروني..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Table */}
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
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: u.role === "admin"
                          ? "linear-gradient(135deg, #0891B2, #14B8A6)"
                          : "#64748B",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                      }}>
                        {u.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{u.id}</div>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ direction: "ltr", fontSize: 13 }}>{u.email}</Td>
                  <Td><Badge status={u.role} /></Td>
                  <Td style={{ fontSize: 13, color: "#64748B" }}>{u.joined}</Td>
                  <Td><Badge status={u.status} /></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Btn sm variant="outline" onClick={() => toggleStatus(u.id)}>
                        تغيير الحالة
                      </Btn>
                      {u.role !== "admin" && (
                        <Btn sm variant="info-light" onClick={() => updateRole(u.id, "admin")}>
                          ترقية لمشرف
                        </Btn>
                      )}
                      {u.role !== "user" && (
                        <Btn sm variant="warning-light" onClick={() => updateRole(u.id, "user")}>
                          إلغاء الإشراف
                        </Btn>
                      )}
                    </div>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8" }}>لا توجد نتائج</div>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
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