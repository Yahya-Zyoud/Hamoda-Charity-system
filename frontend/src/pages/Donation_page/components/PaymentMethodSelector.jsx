// components/PaymentMethodSelector.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Three payment method cards: Stripe (credit card), PayPal, and Cash/Transfer.
// The selected card gets a teal border highlight.
// State is owned by Home.jsx — this component just renders and calls onChange.
// ─────────────────────────────────────────────────────────────────────────────

// Payment methods — id is what gets stored in state, icon is displayed visually
const PAYMENT_METHODS = [
  { id: "stripe",  icon: "💳", label: "بطاقة ائتمانية" },
  { id: "paypal",  icon: "🅿",  label: "PayPal" },
  { id: "cash",    icon: "💵", label: "نقداً / تحويل" },
];

/**
 * @param {string}   paymentMethod - currently selected method id
 * @param {function} onChange      - called with new method id on click
 * @param {string}   error         - Arabic error message
 */
function PaymentMethodSelector({ paymentMethod, onChange, error }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">طريقة الدفع</span>

      <div className="dp-grid-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
            /* dp-payment-btn overrides the active gradient to a border-only style */
            className={`dp-choice-btn dp-payment-btn ${paymentMethod === method.id ? "active" : ""}`}
            onClick={() => onChange(method.id)}
          >
            <span className="dp-payment-icon">{method.icon}</span>
            <span className="dp-payment-label">{method.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default PaymentMethodSelector;
