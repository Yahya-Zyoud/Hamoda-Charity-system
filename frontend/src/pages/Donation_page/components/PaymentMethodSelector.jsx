// components/PaymentMethodSelector.jsx
// Three payment method cards: Stripe, PayPal, Cash.
// Selected card gets a teal border (not a filled background like type/amount).
// State lives in Home.jsx.

const PAYMENT_METHODS = [
  { id: "stripe", icon: "💳", label: "بطاقة ائتمانية" },
  { id: "paypal", icon: "🅿",  label: "PayPal" },
  { id: "cash",   icon: "💵", label: "نقداً / تحويل" },
];

function PaymentMethodSelector({ paymentMethod, onChange, error }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">طريقة الدفع</span>

      <div className="dp-grid-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            type="button"
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
