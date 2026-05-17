// Admin help requests management: filterable table with approve, reject, and delete actions plus AI urgency display.
import { useState, useEffect } from "react";
import { Paperclip, Eye, Inbox, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Btn from "../../components/admin/Btn";
import Badge from "../../components/admin/Badge";
import Modal from "../../components/admin/Modal";
import FilterTabs from "../../components/admin/FilterTabs";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import { useToast, ToastContainer } from "../../components/Toast";
import { getHelpRequests, updateHelpRequestStatus, deleteHelpRequest } from "../../services/api";

// API uses "accepted"; Badge/UI use "approved"
const toUi     = (s) => (s === "accepted" ? "approved" : s);
const toApi    = (s) => (s === "approved"  ? "accepted" : s);
const fmtDate  = (iso) => new Date(iso).toLocaleDateString("ar-SA");
const helpTypeAr = {
  medical: "طبي", education: "تعليمي", food: "غذائي",
  housing: "سكني", financial: "مالي", other: "أخرى",
};

const urgencyAr = { low: "منخفض", medium: "متوسط", high: "عالٍ", critical: "حرج" };
const urgencyColor = { low: "#16A34A", medium: "#D97706", high: "#EA580C", critical: "#DC2626" };

function normalize(r) {
  return {
    id:           r.id,
    name:         r.fullName,
    phone:        r.phone,
    email:        r.email  || "",
    city:         r.city   || "",
    nationalId:   r.nationalId || "",
    type:         helpTypeAr[r.helpType] || r.helpType,
    description:  r.description,
    hasDocuments: !!r.documentPath,
    documentPath: r.documentPath || null,
    status:       toUi(r.status),
    date:         fmtDate(r.createdAt),
    aiUrgency:    r.aiUrgency    || null,
    aiSummary:    r.aiSummary    || "",
    aiConfidence: r.aiConfidence || null,
  };
}

function RequestsPage() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);
  const { toasts, addToast, remove: removeToast } = useToast();

  useEffect(() => {
    getHelpRequests()
      .then((data) => setList(data.map(normalize)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  const update = async (id, uiStatus) => {
    try {
      await updateHelpRequestStatus(id, toApi(uiStatus));
      setList((prev) => prev.map((r) => (r.id === id ? { ...r, status: uiStatus } : r)));
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status: uiStatus }));
      const label = uiStatus === "approved" ? "تم قبول الطلب" : uiStatus === "rejected" ? "تم رفض الطلب" : "تم تحديث الحالة";
      addToast(label, uiStatus === "approved" ? "success" : "error");
    } catch (err) {
      addToast(err?.message || "تعذّر تحديث الحالة", "error");
    }
  };

  const remove = async (id) => {
    try {
      await deleteHelpRequest(id);
      setList((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
      addToast("تم حذف الطلب بنجاح", "success");
    } catch (err) {
      addToast(err?.message || "تعذّر حذف الطلب", "error");
    }
  };

  const counts = {
    all:      list.length,
    pending:  list.filter((r) => r.status === "pending").length,
    approved: list.filter((r) => r.status === "approved").length,
    rejected: list.filter((r) => r.status === "rejected").length,
  };

  const filtered = filter === "all" ? list : list.filter((r) => r.status === filter);

  return (
    <DashboardLayout title="إدارة الطلبات">
      <ToastContainer toasts={toasts} remove={removeToast} />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div />
        <span style={{ background: "#FFFBEB", color: "#D97706", padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: "1px solid #FDE68A" }}>
          {counts.pending} بانتظار المراجعة
        </span>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600 }}>
          تعذّر تحميل الطلبات: {apiError}
        </div>
      )}

      {!loading && !apiError && (
        <>
          <FilterTabs
            active={filter}
            onChange={setFilter}
            tabs={[
              { key: "all",      label: "الكل",          count: counts.all      },
              { key: "pending",  label: "قيد المراجعة",  count: counts.pending  },
              { key: "approved", label: "مقبول",         count: counts.approved },
              { key: "rejected", label: "مرفوض",         count: counts.rejected },
            ]}
          />

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
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{r.city}</div>
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
                          <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 500, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 4 }}>
                            <Paperclip size={11} /> موجود
                          </span>
                        ) : (
                          <span style={{ background: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: 20, fontSize: 12 }}>لا توجد</span>
                        )}
                      </Td>
                      <Td><Badge status={r.status} /></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          <Btn sm variant="ghost" onClick={() => setSelected(r)}><Eye size={13} style={{ marginLeft: 4 }} /> تفاصيل</Btn>
                          {r.status !== "approved" && <Btn sm variant="success-light" onClick={() => update(r.id, "approved")}>قبول</Btn>}
                          {r.status !== "rejected" && <Btn sm variant="danger-light"  onClick={() => update(r.id, "rejected")}>رفض</Btn>}
                        </div>
                      </Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Inbox size={18} /> لا توجد طلبات في هذه الفئة
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <Modal title={`تفاصيل الطلب — ${selected.name}`} onClose={() => setSelected(null)}>
          <div style={{ display: "grid", gap: 2 }}>
            <DetailRow label="اسم المتقدم"    value={selected.name} />
            <DetailRow label="رقم الهوية"     value={<span style={{ direction: "ltr", display: "inline-block" }}>{selected.nationalId}</span>} />
            <DetailRow label="رقم الهاتف"     value={<span style={{ direction: "ltr", display: "inline-block" }}>{selected.phone}</span>} />
            <DetailRow label="البريد الإلكتروني" value={<span style={{ direction: "ltr", display: "inline-block" }}>{selected.email || "—"}</span>} />
            <DetailRow label="المدينة"        value={selected.city || "—"} />
            <DetailRow label="نوع الطلب"      value={
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{selected.type}</span>
            } />
            <DetailRow label="الوصف"          value={selected.description} />
            <DetailRow label="تاريخ الطلب"    value={selected.date} />
            <DetailRow label="الوثائق"        value={selected.hasDocuments
              ? <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#16A34A" }}><CheckCircle2 size={15} /> مرفقة</span>
              : <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#DC2626" }}><XCircle size={15} /> غير مرفقة</span>
            } />
            <DetailRow label="الحالة"         value={<Badge status={selected.status} />} />
          </div>

          {/* Hamoda AI Analysis */}
          {selected.aiUrgency && (
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 16px", marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 8 }}>🤖 تحليل حمودة AI</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: selected.aiSummary ? 8 : 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: urgencyColor[selected.aiUrgency] || "#64748B", background: "#fff", border: `1px solid ${urgencyColor[selected.aiUrgency] || "#E2E8F0"}`, borderRadius: 20, padding: "2px 10px" }}>
                  ⚡ الأولوية: {urgencyAr[selected.aiUrgency] || selected.aiUrgency}
                </span>
                {selected.aiConfidence && (
                  <span style={{ fontSize: 12, color: "#64748B" }}>
                    دقة التحليل: {Math.round(selected.aiConfidence * 100)}%
                  </span>
                )}
              </div>
              {selected.aiSummary && (
                <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>{selected.aiSummary}</p>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {selected.status !== "approved" && (
              <Btn variant="success" onClick={() => update(selected.id, "approved")}>قبول</Btn>
            )}
            {selected.status !== "rejected" && (
              <Btn variant="danger"  onClick={() => update(selected.id, "rejected")}>رفض</Btn>
            )}
            <Btn variant="outline"  onClick={() => remove(selected.id)}>حذف الطلب</Btn>
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

export default RequestsPage;
