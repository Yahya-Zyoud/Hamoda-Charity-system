import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DonationTypeSelector from "./components/DonationTypeSelector";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm from "./components/DonorInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import DonationSummary from "./components/DonationSummary";
import DonationSubmitButton from "./components/DonationSubmitButton";
import { validateDonationForm } from "./utils/validation";
import { createCheckoutSession, createDirectDonation } from "./services/donationService";
import { useAppAuth } from "../../contexts/AppAuthContext";
import { isClerkProviderActive } from "../../lib/clerkConfig";
import { useClerkSignInButton } from "../../hooks/useClerkSignInButton";
import { Heart } from "lucide-react";
import "./styles/donations.css";
import "./styles/responsive.css";

const INITIAL_DONOR = {
  donorName:  "",
  donorEmail: "",
  donorPhone: "",
  donorCity:  "",
  note:       "",
};

function LoginWall() {
  const SignInBtn = useClerkSignInButton(true);

  return (
    <>
      <Navbar />
      <main className="dp-page" dir="rtl">
        <div style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          textAlign: "center",
          padding: "2rem",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
          }}>
            <Heart size={36} color="white" fill="white" />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>
            سجّل دخولك للتبرع
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: 400, margin: 0 }}>
            يرجى تسجيل الدخول أولاً لتتمكن من إتمام عملية التبرع بأمان.
          </p>
          {SignInBtn ? (
            <SignInBtn mode="modal">
              <button style={{
                background: "#2563eb", color: "white", border: "none",
                borderRadius: "0.75rem", padding: "0.875rem 2.5rem",
                fontSize: "1.1rem", fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}>
                تسجيل الدخول
              </button>
            </SignInBtn>
          ) : (
            <button disabled style={{
              background: "#93c5fd", color: "white", border: "none",
              borderRadius: "0.75rem", padding: "0.875rem 2.5rem",
              fontSize: "1.1rem", fontWeight: 700,
            }}>
              جاري التحميل...
            </button>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function DonationPage() {
  const { user, isLoaded } = useAppAuth();
  const [donationType,  setDonationType]  = useState("");
  const [amount,        setAmount]        = useState(null);
  const [donorInfo,     setDonorInfo]     = useState(INITIAL_DONOR);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [fieldErrors,   setFieldErrors]   = useState({});
  const [submitError,   setSubmitError]   = useState("");
  const [success,       setSuccess]       = useState(false);
  const [loading,       setLoading]       = useState(false);

  // Show login wall when Clerk provider is actually active but user is not authenticated
  if (isClerkProviderActive() && isLoaded && !user) {
    return <LoginWall />;
  }

  function handleDonorChange(e) {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const { errors, isValid } = validateDonationForm({
      donationType,
      amount,
      donorInfo,
      paymentMethod,
    });

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "stripe") {
        const { url } = await createCheckoutSession({
          amount,
          donorName:   donorInfo.donorName,
          email:       donorInfo.donorEmail,
          note:        donorInfo.note,
          donationType,
        });
        window.location.href = url;
      } else {
        await createDirectDonation({
          donationType,
          amount,
          donorName:  donorInfo.donorName,
          donorEmail: donorInfo.donorEmail,
          donorPhone: donorInfo.donorPhone,
          donorCity:  donorInfo.donorCity,
          note:       donorInfo.note,
          paymentMethod: "cash",
        });
        setSuccess(true);
        setDonationType("");
        setAmount(null);
        setDonorInfo(INITIAL_DONOR);
        setPaymentMethod("");
      }
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
                  ✓ تم استلام طلب تبرعك بنجاح. شكراً لدعمك!
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

              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onChange={(val) => {
                  setPaymentMethod(val);
                  setFieldErrors((p) => ({ ...p, paymentMethod: "" }));
                }}
                error={fieldErrors.paymentMethod}
              />

              <DonationSubmitButton loading={loading} paymentMethod={paymentMethod} />
            </div>
          </form>

          <aside>
            <DonationSummary
              donationType={donationType}
              amount={amount}
              donorInfo={donorInfo}
              paymentMethod={paymentMethod}
            />
            <div className="dp-info-box">
              <strong>تبرعك آمن 100%</strong>
              تُعالَج المدفوعات عبر Stripe المشفرة. لا نحتفظ ببيانات بطاقتك
              الائتمانية.
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DonationPage;
