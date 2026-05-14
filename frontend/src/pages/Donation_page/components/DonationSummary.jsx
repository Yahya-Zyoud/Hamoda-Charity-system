// components/DonationSummary.jsx
// Live summary card — re-renders automatically whenever props change.
// Shows: type badge, big amount, and a table of all form values.
// No state here — everything comes from Home.jsx as props.

const PAYMENT_LABELS = {
  stripe: "بطاقة ائتمانية (Stripe)",
  paypal: "PayPal",
  cash:   "نقداً / تحويل يدوي",
};

function DonationSummary({
  donationType,
  selectedAmount,
  customAmountText,
  donorName,
  paymentMethod,
}) {
  // Figure out the amount string to display
  let displayAmount = "—";
  if (selectedAmount) {
    displayAmount = `$${selectedAmount.toLocaleString()}`;
  } else if (customAmountText && !isNaN(parseFloat(customAmountText))) {
    displayAmount = `$${parseFloat(customAmountText).toLocaleString()}`;
  }

  return (
    <div className="dp-summary-card">
      <div className="dp-summary-header">
        <span>✅</span>
        <span>ملخص التبرع</span>
      </div>

      {donationType && (
        <div>
          <span className="dp-summary-type-badge">{donationType}</span>
        </div>
      )}

      <div className="dp-summary-amount">{displayAmount}</div>
      <hr className="dp-summary-divider" />

      <div>
        <SummaryRow label="نوع التبرع"  value={donationType || "—"} />
        <SummaryRow label="المبلغ"       value={displayAmount} />
        <SummaryRow label="الاسم"        value={donorName || "—"} />
        <SummaryRow label="طريقة الدفع" value={PAYMENT_LABELS[paymentMethod] || "—"} />
      </div>

      <p className="dp-summary-disclaimer">دار مرجوان متفرعة في موازين الحسنات</p>
    </div>
  );
}

// Small helper — one row inside the summary table
function SummaryRow({ label, value }) {
  return (
    <div className="dp-summary-row">
      <span className="dp-summary-row-label">{label}</span>
      <span className="dp-summary-row-value">{value}</span>
    </div>
  );
}

export default DonationSummary;
