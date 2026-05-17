// Read-only sidebar summary of the selected donation type, amount, donor name, and payment method
function DonationSummary({ donationType, amount, donorInfo }) {
  return (
    <div className="dp-summary">
      <h3 className="dp-summary-title">ملخص التبرع</h3>
      <ul className="dp-summary-list">
        <li className="dp-summary-item">
          <span className="dp-summary-key">نوع التبرع</span>
          <span className="dp-summary-val">{donationType || "—"}</span>
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
          <span className="dp-summary-val">تحويل بنكي / كاش</span>
        </li>
      </ul>
    </div>
  );
}

export default DonationSummary;
