// Donation page: collects donation type, amount, and donor info then submits to the backend
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DonationTypeSelector from "./components/DonationTypeSelector";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm from "./components/DonorInfoForm";
import DonationSummary from "./components/DonationSummary";
import DonationSubmitButton from "./components/DonationSubmitButton";
import { validateDonationForm } from "./utils/validation";
import { createDirectDonation } from "./services/donationService";
import { useAppAuth } from "../../contexts/AppAuthContext";
import "./styles/donations.css";
import "./styles/responsive.css";

const INITIAL_DONOR = {
  donorName:  "",
  donorEmail: "",
  donorPhone: "",
  donorCity:  "",
  note:       "",
};

function DonationPage() {
  const { user } = useAppAuth();
  const [donationType, setDonationType] = useState("");
  const [amount,       setAmount]       = useState(null);
  const [donorInfo,    setDonorInfo]    = useState(INITIAL_DONOR);
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [submitError,  setSubmitError]  = useState("");
  const [success,      setSuccess]      = useState(false);
  const [loading,      setLoading]      = useState(false);

  function handleDonorChange(e) {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const { errors, isValid } = validateDonationForm({ donationType, amount, donorInfo });
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await createDirectDonation({
        donationType,
        amount,
        donorName:     donorInfo.donorName,
        donorEmail:    donorInfo.donorEmail,
        donorPhone:    donorInfo.donorPhone,
        donorCity:     donorInfo.donorCity,
        note:          donorInfo.note,
        paymentMethod: "cash",
        userId:        user?.id || "",
      });
      setSuccess(true);
      setDonationType("");
      setAmount(null);
      setDonorInfo(INITIAL_DONOR);
    } catch (err) {
      setSubmitError(err.message || "حدث خطأ، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="dp-page">
        <section className="dp-hero">
          <span className="dp-hero-badge">تبرع الآن</span>
          <h1>ساهم في صنع الفرق</h1>
          <p>
            تبرعك يصل مباشرة إلى من يحتاجه. اختر نوع التبرع والمبلغ وأكمل
            بياناتك لنتمكن من توصيل مساهمتك بأمان.
          </p>
        </section>

        <div className="dp-layout">
          <form onSubmit={handleSubmit} noValidate>
            <div className="dp-card">
              <h2 className="dp-card-title">تفاصيل التبرع</h2>

              {submitError && (
                <div className="dp-alert dp-alert-error">⚠ {submitError}</div>
              )}
              {success && (
                <div className="dp-alert dp-alert-success">
                  ✓ تم استلام طلب تبرعك بنجاح. سيتواصل معك فريقنا لإتمام التحويل. شكراً لدعمك!
                </div>
              )}

              <DonationTypeSelector
                donationType={donationType}
                onChange={(val) => {
                  setDonationType(val);
                  setFieldErrors((p) => ({ ...p, donationType: "" }));
                }}
                error={fieldErrors.donationType}
              />

              <DonationAmountSelector
                amount={amount}
                onChange={(val) => {
                  setAmount(val);
                  setFieldErrors((p) => ({ ...p, amount: "" }));
                }}
                error={fieldErrors.amount}
              />

              <DonorInfoForm
                donorInfo={donorInfo}
                onChange={handleDonorChange}
                errors={fieldErrors}
              />

              <DonationSubmitButton loading={loading} />
            </div>
          </form>

          <aside>
            <DonationSummary
              donationType={donationType}
              amount={amount}
              donorInfo={donorInfo}
            />
            <div className="dp-info-box">
              <strong>كيف تتم عملية التبرع؟</strong>
              بعد إرسال الطلب يتواصل معك فريقنا لإرشادك إلى رقم الحساب البنكي أو استلام التبرع مباشرة.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DonationPage;
