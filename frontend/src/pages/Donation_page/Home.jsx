// Home.jsx

import { useState, useEffect } from "react";

import DonationTypeSelector from "./components/DonationTypeSelector";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm from "./components/DonorInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import DonationSummary from "./components/DonationSummary";
import DonationSubmitButton from "./components/DonationSubmitButton";

import { validateDonationForm } from "./utils/validation";
import {
  submitDonation,
  fetchRecentDonations,
  fetchDonationStats,
} from "./services/donationService";

import "./styles/donations.css";
import "./styles/responsive.css";

function Home() {
  const [donationType, setDonationType] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmountText, setCustomAmountText] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorCity, setDonorCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [recentDonations, setRecentDonations] = useState([]);
  const [stats, setStats] = useState({
    totalAmountFormatted: "...",
    totalDonors: "...",
  });
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
  }, []);

  async function loadSidebarData() {
    try {
      setSidebarLoading(true);

      const [recent, statsData] = await Promise.all([
        fetchRecentDonations(),
        fetchDonationStats(),
      ]);

      setRecentDonations(recent);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load sidebar data:", err.message);
    } finally {
      setSidebarLoading(false);
    }
  }

  function handleSelectPreset(amount) {
    setSelectedAmount(amount);
    setCustomAmountText("");
    setErrors((prev) => ({ ...prev, amount: undefined }));
    setSubmitError("");
    setSuccessMessage("");
  }

  function handleCustomAmountChange(text) {
    setCustomAmountText(text);
    setSelectedAmount(null);
    setErrors((prev) => ({ ...prev, amount: undefined }));
    setSubmitError("");
    setSuccessMessage("");
  }

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
    setSuccessMessage("");
  }

  async function handleSubmit() {
    const validationErrors = validateDonationForm({
      donationType,
      selectedAmount,
      customAmountText,
      donorName,
      donorEmail,
      donorPhone,
      paymentMethod,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("يرجى تعبئة الحقول المطلوبة بشكل صحيح.");
      setSuccessMessage("");
      return;
    }

    setIsPending(true);
    setErrors({});
    setSubmitError("");
    setSuccessMessage("");

    try {
      const donationPayload = {
        donationType,
        amount: selectedAmount ?? parseFloat(customAmountText),
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim(),
        donorCity: donorCity.trim(),
        paymentMethod,
      };

      const result = await submitDonation(donationPayload);

      setSuccessMessage(result.message || "تم استلام تبرعك بنجاح، شكرًا لك");
      setSubmitError("");

      setDonationType("");
      setSelectedAmount(null);
      setCustomAmountText("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setDonorCity("");
      setPaymentMethod("");

      await loadSidebarData();
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
        setSubmitError("يرجى مراجعة الحقول وإصلاح الأخطاء.");
      } else {
        setSubmitError(
          err.message || "حدث خطأ أثناء إرسال التبرع. يرجى المحاولة مرة أخرى."
        );
      }

      setSuccessMessage("");
      console.error("Donation submission error:", err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="dp-page">
      <header className="dp-header">
        <span className="dp-header-icon">♡</span>
        <h1 className="dp-header-title">منصة الجمعية الخيرية</h1>
        <p className="dp-header-subtitle">
          بوابة عطاء موثوقة، ساهم في إحداث فرق حقيقي في حياة الآخرين بكل سهولة وأمان.
        </p>
      </header>

      <main className="dp-main">
        <aside className="dp-sidebar">
          <div className="dp-impact-card">
            <div className="dp-impact-header">
              <span>📈</span>
              <span>أثر عطائكم</span>
            </div>

            <div className="dp-impact-stat">
              <div className="dp-impact-stat-label">إجمالي التبرعات</div>
              <div className="dp-impact-stat-value">
                {sidebarLoading ? "..." : stats.totalAmountFormatted}
              </div>
            </div>

            <div className="dp-impact-stat">
              <div className="dp-impact-stat-label">عدد المتبرعين</div>
              <div className="dp-impact-stat-value">
                {sidebarLoading ? "..." : stats.totalDonors}
              </div>
            </div>
          </div>

          <div className="dp-recent-title">أحدث التبرعات</div>

          {sidebarLoading ? (
            <p style={{ textAlign: "right", color: "#aaa", fontSize: "13px", padding: "8px" }}>
              جاري التحميل...
            </p>
          ) : recentDonations.length === 0 ? (
            <p style={{ textAlign: "right", color: "#aaa", fontSize: "13px", padding: "8px" }}>
              لا توجد تبرعات بعد
            </p>
          ) : (
            recentDonations.map((donation, index) => (
              <div key={donation._id || index} className="dp-donation-item">
                <span className="dp-donation-badge">{donation.amount}</span>
                <div>
                  <div className="dp-donation-item-name">{donation.name}</div>
                  <div className="dp-donation-item-meta">
                    {donation.type} • {donation.date}
                  </div>
                </div>
              </div>
            ))
          )}
        </aside>

        <section className="dp-form-card">
          <h2 className="dp-form-title">تفاصيل التبرع</h2>

          <DonationTypeSelector
            donationType={donationType}
            onChange={(t) => {
              setDonationType(t);
              clearError("donationType");
            }}
            error={errors.donationType}
          />

          <DonationAmountSelector
            selectedAmount={selectedAmount}
            customAmountText={customAmountText}
            onSelectPreset={handleSelectPreset}
            onCustomChange={handleCustomAmountChange}
            error={errors.amount}
          />

          <DonorInfoForm
            donorName={donorName}
            donorEmail={donorEmail}
            donorPhone={donorPhone}
            donorCity={donorCity}
            onNameChange={(v) => {
              setDonorName(v);
              clearError("donorName");
            }}
            onEmailChange={(v) => {
              setDonorEmail(v);
              clearError("donorEmail");
            }}
            onPhoneChange={(v) => {
              setDonorPhone(v);
              clearError("donorPhone");
            }}
            onCityChange={setDonorCity}
            errors={{
              donorName: errors.donorName,
              donorEmail: errors.donorEmail,
              donorPhone: errors.donorPhone,
            }}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onChange={(m) => {
              setPaymentMethod(m);
              clearError("paymentMethod");
            }}
            error={errors.paymentMethod}
          />

          <DonationSummary
            donationType={donationType}
            selectedAmount={selectedAmount}
            customAmountText={customAmountText}
            donorName={donorName}
            paymentMethod={paymentMethod}
          />

          {successMessage && (
            <div className="dp-success-message">
              ✅ {successMessage}
            </div>
          )}

          {submitError && (
            <div className="dp-submit-error">
              ❌ {submitError}
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <DonationSubmitButton isPending={isPending} onClick={handleSubmit} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;