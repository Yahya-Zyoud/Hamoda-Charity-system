// components/DonationAmountSelector.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shows 6 preset dollar amount buttons + a custom amount text input.
//
// IMPORTANT RULE (enforced here via props logic in Home.jsx):
//   • Clicking a preset button  → selectedAmount is set, customAmountText is cleared
//   • Typing in the custom box  → customAmountText is set, selectedAmount becomes null
//
// This component does NOT manage that logic itself — it just calls the right
// callback (onSelectPreset or onCustomChange) and lets Home.jsx handle state.
// ─────────────────────────────────────────────────────────────────────────────

// Preset amounts displayed as buttons (in the same order as the screenshot)
const PRESET_AMOUNTS = [250, 100, 50, 2500, 1000, 500];

/**
 * @param {number|null} selectedAmount    - which preset is highlighted (null = none)
 * @param {string}      customAmountText  - what's typed in the custom input
 * @param {function}    onSelectPreset    - called with the number when a preset is clicked
 * @param {function}    onCustomChange    - called with the string when user types
 * @param {string}      error             - Arabic error message
 */
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

      {/* Custom amount input */}
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
