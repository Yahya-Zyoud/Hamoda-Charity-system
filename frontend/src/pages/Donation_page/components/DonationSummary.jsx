// components/DonationSummary.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Live summary card — updates instantly as the user fills the form.
// Shows: donation type badge, highlighted amount, and a detail table
// with type / amount / name / payment method.
// All data is props — no state inside this component.
// ─────────────────────────────────────────────────────────────────────────────

// Maps payment method ids to human-readable Arabic labels
const PAYMENT_LABELS = {
  stripe: "بطاقة ائتمانية (Stripe)",
  paypal: "PayPal",
  cash:   "نقداً / تحويل يدوي",
};

/**
 * @param {string}      donationType      - selected type ("صدقة", etc.) or ""
 * @param {number|null} selectedAmount    - preset amount or null
 * @param {string}      customAmountText  - typed custom amount or ""
 * @param {string}      donorName         - donor's name or ""
 * @param {string}      paymentMethod     - selected method id or ""
 */
function DonationSummary({
  donationType,
  selectedAmount,
  customAmountText,
  donorName,
  paymentMethod,
}) {
  // Decide what amount string to show
  let displayAmount = "—";
  if (selectedAmount) {
    displayAmount = `$${selectedAmount.toLocaleString()}`;
  } else if (customAmountText && !isNaN(parseFloat(customAmountText))) {
    displayAmount = `$${parseFloat(customAmountText).toLocaleString()}`;
  }

  return (
    <div className="dp-summary-card">

      {/* Header row */}
      <div className="dp-summary-header">
        <span>✅</span>
        <span>ملخص التبرع</span>
      </div>

      {/* Type badge — only shown when a type is selected */}
      {donationType && (
        <div>
          <span className="dp-summary-type-badge">{donationType}</span>
        </div>
      )}

      {/* Big amount display */}
      <div className="dp-summary-amount">{displayAmount}</div>

      <hr className="dp-summary-divider" />

      {/* Details table */}
      <div>
        <SummaryRow label="نوع التبرع"   value={donationType || "—"} />
        <SummaryRow label="المبلغ"        value={displayAmount} />
        <SummaryRow label="الاسم"         value={donorName || "—"} />
        <SummaryRow label="طريقة الدفع"  value={PAYMENT_LABELS[paymentMethod] || "—"} />
      </div>

      {/* Small disclaimer */}
      <p className="dp-summary-disclaimer">
        دار مرجوان متفرعة في موازين الحسنات
      </p>
    </div>
  );
}

// Small helper component for a single summary row
function SummaryRow({ label, value }) {
  return (
    <div className="dp-summary-row">
      <span className="dp-summary-row-label">{label}</span>
      <span className="dp-summary-row-value">{value}</span>
    </div>
  );
}

export default DonationSummary;
