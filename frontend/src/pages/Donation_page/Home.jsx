// Donation page: collects donation type, amount, and donor info then submits to the backend
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DonationModeSelector from "./components/DonationModeSelector";
import DonationTypeSelector from "./components/DonationTypeSelector";
import ProjectPicker from "./components/ProjectPicker";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm from "./components/DonorInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import DonationSummary from "./components/DonationSummary";
import DonationSubmitButton from "./components/DonationSubmitButton";
import { validateDonationForm } from "./utils/validation";
import { createDirectDonation } from "./services/donationService";
import { useAppAuth } from "../../contexts/AppAuthContext";
import { useToast, ToastContainer } from "../../components/Toast";
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

  const [donationMode,     setDonationMode]     = useState("");           // "project" | "general"
  const [selectedProject,  setSelectedProject]  = useState(null);
  const [donationType,     setDonationType]     = useState("");
  const [paymentMethod,    setPaymentMethod]    = useState("");
  const [amount,           setAmount]           = useState(null);
  const [donorInfo,        setDonorInfo]        = useState(INITIAL_DONOR);
  const [fieldErrors,      setFieldErrors]      = useState({});
  const [loading,          setLoading]          = useState(false);

  const { addToast, toasts, remove } = useToast();

  function handleModeChange(mode) {
    setDonationMode(mode);
    setSelectedProject(null);
    setDonationType("");
    setFieldErrors({});
  }

  function handleDonorChange(e) {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { errors, isValid } = validateDonationForm({
      donationMode,
      donationType,
      selectedProject,
      paymentMethod,
      amount,
      donorInfo,
    });
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await createDirectDonation({
        donationType:    donationMode === "project" ? "تبرع مشروع" : donationType,
        projectId:       selectedProject?.id || selectedProject?._id || null,
        projectTitle:    selectedProject?.title || null,
        amount,
        donorName:       donorInfo.donorName,
        donorEmail:      donorInfo.donorEmail,
        donorPhone:      donorInfo.donorPhone,
        donorCity:       donorInfo.donorCity,
        note:            donorInfo.note,
        paymentMethod,
        userId:          user?.id || "",
      });
      addToast("تم استلام طلب تبرعك بنجاح! شكراً لدعمك ❤️", "success");
      setDonationMode("");
      setSelectedProject(null);
      setDonationType("");
      setPaymentMethod("");
      setAmount(null);
      setDonorInfo(INITIAL_DONOR);
      setFieldErrors({});
    } catch (err) {
      addToast(err.message || "حدث خطأ، يرجى المحاولة مرة أخرى.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToastContainer toasts={toasts} remove={remove} />

      <main className="dp-page">
        <section className="dp-hero">
          <span className="dp-hero-badge">تبرع الآن</span>
          <h1>ساهم في صنع الفرق</h1>
          <p>
            تبرعك يصل مباشرة إلى من يحتاجه. اختر طريقة التبرع والمبلغ وأكمل
            بياناتك لنتمكن من توصيل مساهمتك بأمان.
          </p>
        </section>

        <div className="dp-layout">
          <form onSubmit={handleSubmit} noValidate>
            <div className="dp-card">
              <h2 className="dp-card-title">تفاصيل التبرع</h2>

              {/* Step 1 — pick mode */}
              <DonationModeSelector mode={donationMode} onChange={handleModeChange} />

              {/* Step 2 — project picker or general type */}
              {donationMode === "project" && (
                <ProjectPicker
                  selectedId={selectedProject?.id || selectedProject?._id}
                  onSelect={(p) => {
                    setSelectedProject(p);
                    setFieldErrors((prev) => ({ ...prev, project: "" }));
                  }}
                  error={fieldErrors.project}
                />
              )}

              {donationMode === "general" && (
                <DonationTypeSelector
                  donationType={donationType}
                  onChange={(val) => {
                    setDonationType(val);
                    setFieldErrors((p) => ({ ...p, donationType: "" }));
                  }}
                  error={fieldErrors.donationType}
                />
              )}

              {/* Steps 3-5 — amount, donor info, payment method */}
              {donationMode && (
                <>
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

                  <DonationSubmitButton loading={loading} />
                </>
              )}
            </div>
          </form>

          <aside>
            <DonationSummary
              donationMode={donationMode}
              selectedProject={selectedProject}
              donationType={donationType}
              paymentMethod={paymentMethod}
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
