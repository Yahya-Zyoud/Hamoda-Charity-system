import { useState } from "react";
import DashboardLayout from "../../Components/admin/DashboardLayout";
import Card from "../../Components/admin/Card";
import Btn from "../../Components/admin/Btn";
import Badge from "../../Components/admin/Badge";
import Modal from "../../Components/admin/Modal";
import FilterTabs from "../../Components/admin/FilterTabs";
import { Th, Td, TableRow } from "../../Components/admin/TableParts";
import { REQUESTS_DATA } from "../../data/mockAdminData";

function RequestsPage() {
  const [list, setList] = useState(REQUESTS_DATA);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [noteText, setNoteText] = useState("");

  const update = (id, status) => {
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected(null);
  };

  const saveNote = (id) => {
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, notes: noteText } : r))
    );
  };

  const counts = {
    all: list.length,
    pending: list.filter((r) => r.status === "pending").length,
    approved: list.filter((r) => r.status === "approved").length,
    rejected: list.filter((r) => r.status === "rejected").length,
    on_hold: list.filter((r) => r.status === "on_hold").length,
  };

  const filtered = filter === "all" ? list : list.filter((r) => r.status === filter);

  return (
    <DashboardLayout title="إدارة الطلبات">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <span style={{ background: "#FFFBEB", color: "#D97706", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid #FDE68A" }}>
          {counts.pending} بانتظار المراجعة
        </span>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        active={filter}
        onChange={setFilter}
        tabs={[
          { key: "all", label: "الكل", count: counts.all },
          { key: "pending", label: "قيد المراجعة", count: counts.pending },
          { key: "approved", label: "مقبول", count: counts.approved },
          { key: "rejected", label: "مرفوض", count: counts.rejected },
          { key: "on_hold", label: "معلق", count: counts.on_hold },
        ]}
      />

      {/* Table */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <Th>المتقدم</Th>
                <Th>الهاتف</Th>
                <Th>النوع</Th>
                <Th>الوصف</Th>
                <Th>الوثائق</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{r.id}</div>
                  </Td>
                  <Td style={{ direction: "ltr" }}>{r.phone}</Td>
                  <Td>
                    <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid #bfdbfe" }}>
                      {r.type}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 13, color: "#64748B", display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.description}
                    </span>
                  </Td>
                  <Td>
                    {r.hasDocuments ? (
                      <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid #BBF7D0" }}>📎 موجود</span>
                    ) : (
                      <span style={{ background: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: 20, fontSize: 12 }}>لا توجد</span>
                    )}
                  </Td>
                  <Td><Badge status={r.status} /></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <Btn sm variant="ghost" onClick={() => { setSelected(r); setNoteText(r.notes || ""); }}>👁 تفاصيل</Btn>
                      {r.status !== "approved" && <Btn sm variant="success-light" onClick={() => update(r.id, "approved")}>قبول</Btn>}
                      {r.status !== "rejected" && <Btn sm variant="danger-light" onClick={() => update(r.id, "rejected")}>رفض</Btn>}
                      {r.status !== "on_hold" && <Btn sm variant="info-light" onClick={() => update(r.id, "on_hold")}>تعليق</Btn>}
                    </div>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8" }}>📭 لا توجد طلبات في هذه الفئة</div>
          )}
        </div>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <Modal title={`تفاصيل الطلب — ${selected.id}`} onClose={() => setSelected(null)}>
          <div style={{ display: "grid", gap: 2 }}>
            <DetailRow label="اسم المتقدم" value={selected.name} />
            <DetailRow label="رقم الهاتف" value={<span style={{ direction: "ltr", display: "inline-block" }}>{selected.phone}</span>} />
            <DetailRow label="نوع الطلب" value={
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{selected.type}</span>
            } />
            <DetailRow label="الوصف" value={selected.description} />
            <DetailRow label="تاريخ الطلب" value={selected.date} />
            <DetailRow label="الوثائق" value={selected.hasDocuments ? "✅ مرفقة" : "❌ غير مرفقة"} />
            <DetailRow label="الحالة" value={<Badge status={selected.status} />} />
          </div>

          {/* Internal Notes */}
          <div style={{ marginTop: 20, padding: 16, background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>📝 ملاحظات داخلية</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="أضف ملاحظة داخلية حول هذا الطلب..."
              style={{
                width: "100%",
                minHeight: 80,
                padding: "10px 14px",
                border: "2px solid #E2E8F0",
                borderRadius: 10,
                fontSize: 14,
                fontFamily: "'Tajawal', sans-serif",
                resize: "vertical",
                color: "#1E293B",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
            />
            <Btn sm variant="outline" style={{ marginTop: 8 }} onClick={() => saveNote(selected.id)}>
              💾 حفظ الملاحظة
            </Btn>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <Btn variant="success" onClick={() => update(selected.id, "approved")}>✔ قبول</Btn>
            <Btn variant="danger" onClick={() => update(selected.id, "rejected")}>✘ رفض</Btn>
            <Btn variant="outline" onClick={() => update(selected.id, "on_hold")}>⏸ تعليق</Btn>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F1F5F9", alignItems: "flex-start" }}>
      <span style={{ color: "#64748B", fontSize: 13, width: 130, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 14, color: "#1E293B", flex: 1 }}>{value}</span>
    </div>
  );
}

export default RequestsPage;