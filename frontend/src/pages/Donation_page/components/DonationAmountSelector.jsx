// components/DonationAmountSelector.jsx
// 6 preset amount buttons + a custom amount text input.
// KEY RULE: selecting a preset clears the custom input, and vice versa.
// This rule is enforced by calling the right callback — Home.jsx handles the state.

const PRESET_AMOUNTS = [250, 100, 50, 2500, 1000, 500];

function DonationAmountSelector({
  selectedAmount,
  customAmountText,
  onSelectPreset,
  onCustomChange,
  error,
}) {
  return (
    <div className="dp-section">
      <span className="dp-section-label">المبلغ (USD)</span>

      {/* Preset buttons */}
      <div className="dp-grid-3">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`dp-choice-btn dp-amount-btn ${selectedAmount === amount ? "active" : ""}`}
            onClick={() => onSelectPreset(amount)}
          >
            ${amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="dp-custom-amount-wrapper">
        <span className="dp-currency-symbol">$</span>
        <input
          type="number"
          className="dp-custom-input"
          placeholder="أو أدخل مبلغاً مخصصاً"
          value={customAmountText}
          onChange={(e) => onCustomChange(e.target.value)}
          min="1"
        />
      </div>

      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default DonationAmountSelector;
