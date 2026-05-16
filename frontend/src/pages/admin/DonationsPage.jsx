import { useState, useEffect } from "react";
import { Eye, Search, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import Btn from "../../components/admin/Btn";
import Badge from "../../components/admin/Badge";
import Modal from "../../components/admin/Modal";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import { getDonations } from "../../services/api";

const normalize = (d) => ({
  id:      d.id,
  donor:   d.donorName             || d.donor || "متبرع",
  email:   d.donorEmail            || d.email || "—",
  amount:  d.amount,
  project: d.projectId?.title      || "—",
  method:  d.paymentMethod         || d.method || "—",
  type:    d.donationType          || "—",
  date:    new Date(d.createdAt).toLocaleDateString("ar-SA"),
  status:  d.status,
});

function DonationsPage() {
  const [list,         setList]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected,     setSelected]     = useState(null);

  useEffect(() => {
    getDonations()
      .then((data) => setList(data.map(normalize)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const filtered = list.filter((d) => {
    const matchSearch =
      d.donor.includes(search) || d.project.includes(search) || d.email.includes(search);
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = filtered.reduce((s, d) => s + d.amount, 0);

  return (
    <DashboardLayout title="إدارة التبرعات">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "6px 18px", borderRadius: 20, fontWeight: 700, fontSize: 14, border: "1px solid #BBF7D0" }}>
          الإجمالي: ${total.toLocaleString()}
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل التبرعات: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <>
          {/* Search & Filter */}
          <Card style={{ padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input placeholder="بحث بالاسم، المشروع، البريد..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">جميع الحالات</option>
              <option value="completed">مكتمل</option>
              <option value="pending">قيد المعالجة</option>
              <option value="failed">فشل</option>
            </Select>
          </Card>

          {/* Table */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th>المتبرع</Th>
                    <Th>البريد الإلكتروني</Th>
                    <Th>المبلغ</Th>
                    <Th>المشروع</Th>
                    <Th>طريقة الدفع</Th>
                    <Th>التاريخ</Th>
                    <Th>الحالة</Th>
                    <Th>إجراء</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <TableRow key={d.id}>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                            {(d.donor[0] || "م")}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{d.donor}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8" }}>{String(d.id).slice(-6)}</div>
                          </div>
                        </div>
                      </Td>
                      <Td style={{ fontSize: 13, direction: "ltr" }}>{d.email}</Td>
                      <Td><span style={{ fontWeight: 700, color: "#16A34A" }}>${d.amount.toLocaleString()}</span></Td>
                      <Td><span style={{ fontSize: 13 }}>{d.project}</span></Td>
                      <Td><span style={{ background: "#F1F5F9", color: "#374151", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{d.method}</span></Td>
                      <Td style={{ fontSize: 13, color: "#64748B" }}>{d.date}</Td>
                      <Td><Badge status={d.status} /></Td>
                      <Td><Btn sm variant="ghost" onClick={() => setSelected(d)}><Eye size={13} style={{ marginLeft: 4 }} /> تفاصيل</Btn></Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Search size={18} /> {list.length === 0 ? "لا توجد تبرعات حتى الآن" : "لا توجد نتائج مطابقة"}
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal title={`تفاصيل التبرع — ${String(selected.id).slice(-6)}`} onClose={() => setSelected(null)}>
          <div style={{ display: "grid", gap: 2 }}>
            <DetailRow label="المتبرع"           value={selected.donor} />
            <DetailRow label="البريد الإلكتروني" value={<span style={{ direction: "ltr", display: "inline-block" }}>{selected.email}</span>} />
            <DetailRow label="نوع التبرع"        value={selected.type} />
            <DetailRow label="المبلغ"            value={<span style={{ fontWeight: 700, color: "#16A34A", fontSize: 18 }}>${selected.amount.toLocaleString()}</span>} />
            <DetailRow label="المشروع"           value={selected.project} />
            <DetailRow label="طريقة الدفع"       value={selected.method} />
            <DetailRow label="التاريخ"           value={selected.date} />
            <DetailRow label="الحالة"            value={<Badge status={selected.status} />} />
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F1F5F9", alignItems: "flex-start" }}>
      <span style={{ color: "#64748B", fontSize: 13, width: 140, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 14, color: "#1E293B", flex: 1 }}>{value}</span>
    </div>
  );
}

export default DonationsPage;
