// Home.jsx
// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE — owns ALL form state and passes it to child components as props.
// This is the "lifting state up" pattern: one parent controls everything,
// children just display data and fire callbacks.
//
// Flow:
//   User interacts → child calls a callback → Home.jsx updates state
//   → React re-renders → child receives new props → UI updates
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";

import DonationTypeSelector   from "./components/DonationTypeSelector";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm          from "./components/DonorInfoForm";
import PaymentMethodSelector  from "./components/PaymentMethodSelector";
import DonationSummary        from "./components/DonationSummary";
import DonationSubmitButton   from "./components/DonationSubmitButton";

import { validateDonationForm } from "./utils/validation";
import { submitDonation }       from "./services/donationService";

import "./styles/donations.css";
import "./styles/responsive.css";

// Static recent donations shown in sidebar
// TODO: replace with a real fetch('/api/donations/recent') call
const RECENT_DONATIONS = [
  { amount: "$100",  name: "محمد أحمد",     type: "صدقة", date: "13 مايو 2026" },
  { amount: "$1000", name: "يوسف المحطاني", type: "صدقة", date: "13 مايو 2026" },
  { amount: "$250",  name: "سارة المظري",   type: "زكاة", date: "14 مايو 2026" },
  { amount: "$500",  name: "أحمد محمد علي", type: "زكاة", date: "12 مايو 2026" },
  { amount: "$100",  name: "فاطمة إبراهيم", type: "صدقة", date: "11 مايو 2026" },
  { amount: "$250",  name: "محمد عبدالله",  type: "صدقة", date: "11 مايو 2026" },
];

function Home() {

  // ── All Form State ───────────────────────────────────────────────────────
  const [donationType,     setDonationType]     = useState("");
  const [selectedAmount,   setSelectedAmount]   = useState(null);   // number | null
  const [customAmountText, setCustomAmountText] = useState("");      // string
  const [donorName,        setDonorName]        = useState("");
  const [donorEmail,       setDonorEmail]       = useState("");
  const [donorPhone,       setDonorPhone]       = useState("");
  const [donorCity,        setDonorCity]        = useState("");
  const [paymentMethod,    setPaymentMethod]    = useState("");
  const [errors,           setErrors]           = useState({});
  const [isPending,        setIsPending]        = useState(false);
  // ────────────────────────────────────────────────────────────────────────

  // Clear one specific error (called when user starts correcting a field)
  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // Preset amount selected → clear custom input
  function handleSelectPreset(amount) {
    setSelectedAmount(amount);
    setCustomAmountText("");
    clearError("amount");
  }

  // User types custom amount → deselect preset
  function handleCustomAmountChange(text) {
    setCustomAmountText(text);
    setSelectedAmount(null);
    clearError("amount");
  }

  // Form submission
  async function handleSubmit() {
    // 1. Validate
    const validationErrors = validateDonationForm({
      donationType, selectedAmount, customAmountText,
      donorName, donorEmail, donorPhone, paymentMethod,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop — show errors to user
    }

    // 2. Build payload
    const donationPayload = {
      donationType,
      amount:        selectedAmount ?? parseFloat(customAmountText),
      donorName:     donorName.trim(),
      donorEmail:    donorEmail.trim(),
      donorPhone:    donorPhone.trim(),
      donorCity:     donorCity.trim(),
      paymentMethod,
    };

    // 3. Submit
    setIsPending(true);
    setErrors({});

    try {
      const result = await submitDonation(donationPayload); // ← service layer
      alert(`✅ ${result.message}`);

      // 4. Reset form on success
      setDonationType(""); setSelectedAmount(null); setCustomAmountText("");
      setDonorName(""); setDonorEmail(""); setDonorPhone("");
      setDonorCity(""); setPaymentMethod("");

    } catch (err) {
      alert("❌ حدث خطأ أثناء إرسال التبرع. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="dp-page">

      {/* Header */}
      <header className="dp-header">
        <span className="dp-header-icon">♡</span>
        <h1 className="dp-header-title">منصة الجمعية الخيرية</h1>
        <p className="dp-header-subtitle">
          بوابة عطاء موثوقة، ساهم في إحداث فرق حقيقي في حياة الآخرين بكل سهولة وأمان.
        </p>
      </header>

      {/* Main: sidebar + form */}
      <main className="dp-main">

        {/* Sidebar */}
        <aside className="dp-sidebar">
          <div className="dp-impact-card">
            <div className="dp-impact-header">
              <span>📈</span><span>أثر عطائكم</span>
            </div>
            <div className="dp-impact-stat">
              <div className="dp-impact-stat-label">إجمالي التبرعات</div>
              <div className="dp-impact-stat-value">$5,750</div>
            </div>
            <div className="dp-impact-stat">
              <div className="dp-impact-stat-label">عدد المتبرعين</div>
              <div className="dp-impact-stat-value">9</div>
            </div>
          </div>

          <div className="dp-recent-title">أحدث التبرعات</div>

          {RECENT_DONATIONS.map((d, i) => (
            <div key={i} className="dp-donation-item">
              <span className="dp-donation-badge">{d.amount}</span>
              <div>
                <div className="dp-donation-item-name">{d.name}</div>
                <div className="dp-donation-item-meta">{d.type} • {d.date}</div>
              </div>
            </div>
          ))}
        </aside>

        {/* Form card */}
        <section className="dp-form-card">
          <h2 className="dp-form-title">تفاصيل التبرع</h2>

          {/* 1. Type */}
          <DonationTypeSelector
            donationType={donationType}
            onChange={(t) => { setDonationType(t); clearError("donationType"); }}
            error={errors.donationType}
          />

          {/* 2. Amount */}
          <DonationAmountSelector
            selectedAmount={selectedAmount}
            customAmountText={customAmountText}
            onSelectPreset={handleSelectPreset}
            onCustomChange={handleCustomAmountChange}
            error={errors.amount}
          />

          {/* 3. Personal info */}
          <DonorInfoForm
            donorName={donorName}   donorEmail={donorEmail}
            donorPhone={donorPhone} donorCity={donorCity}
            onNameChange={(v)  => { setDonorName(v);  clearError("donorName");  }}
            onEmailChange={(v) => { setDonorEmail(v); clearError("donorEmail"); }}
            onPhoneChange={(v) => { setDonorPhone(v); clearError("donorPhone"); }}
            onCityChange={setDonorCity}
            errors={{ donorName: errors.donorName, donorEmail: errors.donorEmail, donorPhone: errors.donorPhone }}
          />

          {/* 4. Payment */}
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onChange={(m) => { setPaymentMethod(m); clearError("paymentMethod"); }}
            error={errors.paymentMethod}
          />

          {/* 5. Live summary */}
          <DonationSummary
            donationType={donationType}
            selectedAmount={selectedAmount}
            customAmountText={customAmountText}
            donorName={donorName}
            paymentMethod={paymentMethod}
          />

          {/* 6. Submit */}
          <div style={{ marginTop: "20px" }}>
            <DonationSubmitButton isPending={isPending} onClick={handleSubmit} />
          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;
