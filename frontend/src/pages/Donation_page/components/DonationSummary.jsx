const PAYMENT_LABELS = { stripe: "بطاقة ائتمانية", cash: "كاش / تحويل" };

function DonationSummary({ donationMode, selectedProject, donationType, paymentMethod, amount, donorInfo }) {
  const typeLabel =
    donationMode === "project"
      ? (selectedProject?.title || "—")
      : (donationType || "—");

  const typeKey = donationMode === "project" ? "المشروع" : "نوع التبرع";

  return (
    <div className="dp-summary">
      <h3 className="dp-summary-title">ملخص التبرع</h3>
      <ul className="dp-summary-list">
        <li className="dp-summary-item">
          <span className="dp-summary-key">طريقة التبرع</span>
          <span className="dp-summary-val">
            {donationMode === "project" ? "تبرع لمشروع" : donationMode === "general" ? "تبرع عام" : "—"}
          </span>
        </li>
        <li className="dp-summary-item">
          <span className="dp-summary-key">{typeKey}</span>
          <span className="dp-summary-val">{typeLabel}</span>
        </li>
        <li className="dp-summary-item">
          <span className="dp-summary-key">المبلغ</span>
          <span className="dp-summary-val dp-summary-amount">
            {amount ? `$${amount}` : "—"}
          </span>
        </li>
        <li className="dp-summary-item">
          <span className="dp-summary-key">الاسم</span>
          <span className="dp-summary-val">{donorInfo.donorName || "—"}</span>
        </li>
        <li className="dp-summary-item">
          <span className="dp-summary-key">طريقة الدفع</span>
          <span className="dp-summary-val">{PAYMENT_LABELS[paymentMethod] || "—"}</span>
        </li>
      </ul>
    </div>
  );
}

export default DonationSummary;
