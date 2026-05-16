import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import Btn from "../../components/admin/Btn";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import { getUsers, adminUpdateUserRole, adminUpdateUserStatus } from "../../services/api";

const ROLE_OPTIONS   = ["user", "admin"];
const STATUS_OPTIONS = ["active", "suspended"];

const roleAr   = { user: "مستخدم", admin: "مشرف" };
const statusAr = { active: "نشط", suspended: "موقوف" };

function normalize(u) {
  return {
    id:        u._id || u.id,
    clerkId:   u.clerkId || "—",
    name:      u.name  || u.fullName || "—",
    email:     u.email || "—",
    phone:     u.phone || "—",
    city:      u.city  || "—",
    role:      u.role   || "user",
    status:    u.status || "active",
    createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("ar-SA") : "—",
  };
}

function RegisteredUsersPage() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    getUsers()
      .then((data) => setList(Array.isArray(data) ? data.map(normalize) : []))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const updateRole = async (id, role) => {
    try {
      await adminUpdateUserRole(id, role);
      setList((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    } catch {}
  };

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateUserStatus(id, status);
      setList((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
    } catch {}
  };

  const filtered = list.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout title="المستخدمون المسجّلون">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ background: "#EFF6FF", color: "#2563eb", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid #BFDBFE" }}>
          {list.length} مستخدم مسجّل
        </span>
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
              placeholder="بحث بالاسم، البريد، المدينة..."
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
                    <Th>البريد الإلكتروني</Th>
                    <Th>الهاتف</Th>
                    <Th>المدينة</Th>
                    <Th>تاريخ التسجيل</Th>
                    <Th>الدور</Th>
                    <Th>الحالة</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#60a5fa)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                            {(u.name[0] || "م")}
                          </div>
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </Td>
                      <Td style={{ direction: "ltr", fontSize: 13, color: "#64748B" }}>{u.email}</Td>
                      <Td style={{ direction: "ltr", fontSize: 13, color: "#64748B" }}>{u.phone}</Td>
                      <Td style={{ fontSize: 13 }}>{u.city}</Td>
                      <Td style={{ fontSize: 13, color: "#64748B" }}>{u.createdAt}</Td>
                      <Td>
                        <Select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          style={{ fontSize: 12, padding: "4px 8px" }}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{roleAr[r]}</option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          value={u.status}
                          onChange={(e) => updateStatus(u.id, e.target.value)}
                          style={{ fontSize: 12, padding: "4px 8px", color: u.status === "suspended" ? "#DC2626" : "#16A34A" }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{statusAr[s]}</option>
                          ))}
                        </Select>
                      </Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8" }}>
                  {list.length === 0
                    ? "لا يوجد مستخدمون مسجّلون بعد — يظهرون هنا عند زيارة صفحة الملف الشخصي لأول مرة"
                    : "لا توجد نتائج مطابقة"}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}

export default RegisteredUsersPage;
