// Admin donations management: searchable/filterable table with accept, reject, revert, and delete actions.
import { useState, useEffect, useCallback } from "react";
import { Eye, Search, Loader2, CheckCircle2, XCircle, Trash2, RotateCcw } from "lucide-react";
import DashboardLayout from "../../components/admin/DashboardLayout";
import Card from "../../components/admin/Card";
import Input from "../../components/admin/Input";
import Select from "../../components/admin/Select";
import Btn from "../../components/admin/Btn";
import Badge from "../../components/admin/Badge";
import Modal from "../../components/admin/Modal";
import { Th, Td, TableRow } from "../../components/admin/TableParts";
import { useToast, ToastContainer } from "../../components/Toast";
import { getDonations, updateDonationStatus, deleteDonation } from "../../services/api";

const normalize = (d) => ({
  id:        d.id,
  donor:     d.donorName    || "متبرع",
  email:     d.donorEmail   || "—",
  phone:     d.donorPhone   || "—",
  city:      d.donorCity    || "—",
  note:      d.note         || "",
  amount:    Number(d.amount) || 0,
  project:   d.projectId?.title || "—",
  projectId: d.projectId?._id || d.projectId || null,
  method:    d.paymentMethod || "—",
  type:      d.donationType  || "—",
  date:      d.createdAt ? new Date(d.createdAt).toLocaleString("ar-SA") : "—",
  status:    d.status || "pending",
});

const STATUS_OPTIONS = [
  { value: "all",      label: "جميع الحالات" },
  { value: "pending",  label: "قيد المراجعة" },
  { value: "accepted", label: "مقبول"         },
  { value: "rejected", label: "مرفوض"         },
];

function DonationsPage() {
  const [list,         setList]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [updating,     setUpdating]     = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [confirmDel,   setConfirmDel]   = useState(null); // id to delete

  const { toasts, addToast, remove } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    setApiError(null);
    getDonations()
      .then((data) => setList(data.map(normalize)))
      .catch((err)  => setApiError(err.message))
      .finally(()   => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = list.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = d.donor.includes(search) || d.email.includes(q) || d.project.includes(search) || d.type.includes(search);
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = list.filter((d) => d.status === "accepted").reduce((s, d) => s + d.amount, 0);

  const handleStatus = async (id, status) => {
    setUpdating(true);
    try {
      await updateDonationStatus(id, status);
      const update = (d) => d.id === id ? { ...d, status } : d;
      setList((prev) => prev.map(update));
      setSelected((prev) => prev?.id === id ? { ...prev, status } : prev);
      const label = status === "accepted" ? "تم قبول التبرع ✓" : status === "rejected" ? "تم رفض التبرع" : "تم تحديث الحالة";
      addToast(label, status === "accepted" ? "success" : "error");
    } catch (err) {
      addToast(err?.message || "تعذّر تحديث الحالة", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteDonation(id);
      setList((prev) => prev.filter((d) => d.id !== id));
      if (selected?.id === id) setSelected(null);
      setConfirmDel(null);
      addToast("تم حذف التبرع بنجاح", "success");
    } catch (err) {
      addToast(err?.message || "تعذّر حذف التبرع", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="إدارة التبرعات">
      <ToastContainer toasts={toasts} remove={remove} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {STATUS_OPTIONS.slice(1).map((s) => {
            const count = list.filter((d) => d.status === s.value).length;
            return (
              <span key={s.value} style={{ fontSize: 13, color: "#64748B" }}>
                {s.label}: <strong style={{ color: "#1E293B" }}>{count}</strong>
              </span>
            );
          })}
        </div>
        <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "6px 18px", borderRadius: 20, fontWeight: 700, fontSize: 14, border: "1px solid #BBF7D0" }}>
          إجمالي المقبول: ${total.toLocaleString()}
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Loader2 size={18} className="spin" /> جاري التحميل...
        </div>
      )}
      {apiError && (
        <div style={{ background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>تعذّر تحميل التبرعات: {apiError}</span>
          <Btn sm variant="ghost" onClick={load}>إعادة المحاولة</Btn>
        </div>
      )}

      {!loading && !apiError && (
        <>
          {/* Search & Filter */}
          <Card style={{ padding: "14px 16px", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input
                placeholder="بحث بالاسم، البريد، المشروع، نوع التبرع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </Card>

          {/* Table */}
          <Card style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th>المتبرع</Th>
                    <Th>نوع التبرع</Th>
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
                      <Td><span style={{ fontSize: 13 }}>{d.type}</span></Td>
                      <Td><span style={{ fontWeight: 700, color: "#16A34A" }}>${d.amount.toLocaleString()}</span></Td>
                      <Td><span style={{ fontSize: 13 }}>{d.project}</span></Td>
                      <Td><span style={{ background: "#F1F5F9", color: "#374151", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>{d.method}</span></Td>
                      <Td style={{ fontSize: 12, color: "#64748B" }}>{d.date}</Td>
                      <Td><Badge status={d.status} /></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <Btn sm variant="ghost" onClick={() => setSelected(d)}>
                            <Eye size={13} style={{ marginLeft: 4 }} /> تفاصيل
                          </Btn>
                          {d.status === "pending" && (
                            <>
                              <Btn sm variant="success-light" onClick={() => handleStatus(d.id, "accepted")} disabled={updating}>
                                <CheckCircle2 size={12} />
                              </Btn>
                              <Btn sm variant="danger-light" onClick={() => handleStatus(d.id, "rejected")} disabled={updating}>
                                <XCircle size={12} />
                              </Btn>
                            </>
                          )}
                          {d.status !== "pending" && (
                            <Btn sm variant="ghost" onClick={() => handleStatus(d.id, "pending")} disabled={updating} title="إعادة للمراجعة">
                              <RotateCcw size={12} />
                            </Btn>
                          )}
                          <Btn sm variant="danger-light" onClick={() => setConfirmDel(d.id)} disabled={deleting}>
                            <Trash2 size={12} />
                          </Btn>
                        </div>
                      </Td>
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
            <DetailRow label="رقم الهاتف"        value={selected.phone} />
            <DetailRow label="المدينة"           value={selected.city} />
            <DetailRow label="نوع التبرع"        value={selected.type} />
            <DetailRow label="المبلغ"            value={<span style={{ fontWeight: 700, color: "#16A34A", fontSize: 18 }}>${selected.amount.toLocaleString()}</span>} />
            <DetailRow label="المشروع"           value={selected.project} />
            <DetailRow label="طريقة الدفع"       value={selected.method} />
            <DetailRow label="التاريخ"           value={selected.date} />
            <DetailRow label="الحالة"            value={<Badge status={selected.status} />} />
            {selected.note && <DetailRow label="الملاحظات" value={selected.note} />}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {selected.status !== "accepted" && (
              <Btn
                variant="success-light"
                onClick={() => handleStatus(selected.id, "accepted")}
                disabled={updating}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {updating ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                قبول التبرع
              </Btn>
            )}
            {selected.status !== "rejected" && (
              <Btn
                variant="danger-light"
                onClick={() => handleStatus(selected.id, "rejected")}
                disabled={updating}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {updating ? <Loader2 size={14} className="spin" /> : <XCircle size={14} />}
                رفض التبرع
              </Btn>
            )}
            {selected.status !== "pending" && (
              <Btn
                variant="ghost"
                onClick={() => handleStatus(selected.id, "pending")}
                disabled={updating}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <RotateCcw size={14} /> إعادة للمراجعة
              </Btn>
            )}
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 16, paddingTop: 12 }}>
            <Btn
              variant="danger-light"
              onClick={() => { setSelected(null); setConfirmDel(selected.id); }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Trash2 size={14} /> حذف هذا التبرع
            </Btn>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {confirmDel && (
        <Modal title="تأكيد الحذف" onClose={() => setConfirmDel(null)}>
          <p style={{ color: "#475569", marginBottom: 20, lineHeight: 1.7 }}>
            هل أنت متأكد من حذف هذا التبرع؟ <br />
            <strong style={{ color: "#DC2626" }}>لا يمكن التراجع عن هذا الإجراء.</strong>
            {list.find((d) => d.id === confirmDel)?.status === "accepted" && (
              <><br /><span style={{ color: "#D97706" }}>⚠ سيتم خصم مبلغه من إجمالي التبرعات ومن تقدم المشروع.</span></>
            )}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger-light" onClick={() => handleDelete(confirmDel)} disabled={deleting}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {deleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />} تأكيد الحذف
            </Btn>
            <Btn variant="outline" onClick={() => setConfirmDel(null)} style={{ flex: 1 }}>إلغاء</Btn>
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
