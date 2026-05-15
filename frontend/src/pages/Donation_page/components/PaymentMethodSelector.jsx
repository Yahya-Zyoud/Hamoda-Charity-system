const PAYMENT_METHODS = [
  { id: "stripe", label: "بطاقة ائتمانية", sub: "Visa / Mastercard" },
  { id: "cash",   label: "كاش / تحويل",   sub: "دفع يدوي" },
];

function PaymentMethodSelector({ paymentMethod, onChange, error }) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">طريقة الدفع</span>
      <div className="dp-grid-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`dp-choice-btn ${paymentMethod === m.id ? "active" : ""}`}
            onClick={() => onChange(m.id)}
          >
            <span className="dp-type-main">{m.label}</span>
            <span className="dp-type-sub">{m.sub}</span>
          </button>
        ))}
      </div>
      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default PaymentMethodSelector;
