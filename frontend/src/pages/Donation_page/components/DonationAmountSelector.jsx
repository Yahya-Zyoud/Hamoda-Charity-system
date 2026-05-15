import { useState } from "react";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

function DonationAmountSelector({ amount, onChange, error }) {
  const [custom, setCustom] = useState("");

  function handlePreset(val) {
    setCustom("");
    onChange(val);
  }

  function handleCustom(e) {
    const val = e.target.value;
    setCustom(val);
    const num = Number(val);
    if (num > 0) onChange(num);
    else onChange(null);
  }

  const isPresetActive = (v) => amount === v && !custom;

  return (
    <div className="dp-section">
      <span className="dp-section-label">مبلغ التبرع (بالدولار)</span>
      <div className="dp-grid-3">
        {PRESET_AMOUNTS.map((v) => (
          <button
            key={v}
            type="button"
            className={`dp-choice-btn ${isPresetActive(v) ? "active" : ""}`}
            onClick={() => handlePreset(v)}
          >
            <span className="dp-type-main">${v}</span>
          </button>
        ))}
      </div>
      <input
        type="number"
        className="dp-custom-amount"
        placeholder="أو أدخل مبلغاً مخصصاً..."
        value={custom}
        min="1"
        onChange={handleCustom}
      />
      {error && <p className="dp-error-msg">⚠ {error}</p>}
    </div>
  );
}

export default DonationAmountSelector;
