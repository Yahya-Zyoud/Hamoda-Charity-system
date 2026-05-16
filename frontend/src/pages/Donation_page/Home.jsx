import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DonationTypeSelector from "./components/DonationTypeSelector";
import DonationAmountSelector from "./components/DonationAmountSelector";
import DonorInfoForm from "./components/DonorInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import DonationSummary from "./components/DonationSummary";
import DonationSubmitButton from "./components/DonationSubmitButton";
import { validateDonationForm } from "./utils/validation";
import { createDirectDonation } from "./services/donationService";
import { getProjectById } from "../../services/api";
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
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [donationType,   setDonationType]   = useState("");
  const [amount,         setAmount]         = useState(null);
  const [paymentMethod,  setPaymentMethod]  = useState("cash");
  const [donorInfo,      setDonorInfo]      = useState(INITIAL_DONOR);
  const [fieldErrors,    setFieldErrors]    = useState({});
  const [submitError,    setSubmitError]    = useState("");
  const [success,        setSuccess]        = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [project,        setProject]        = useState(null);
  const [projectError,   setProjectError]   = useState("");

  useEffect(() => {
    if (!projectId) { setProject(null); return; }
    let cancelled = false;
    getProjectById(projectId)
      .then((data) => { if (!cancelled) setProject(data); })
      .catch(() => { if (!cancelled) setProjectError("تعذّر تحميل بيانات المشروع. سيتم متابعة التبرع العام."); });
    return () => { cancelled = true; };
  }, [projectId]);

  function handleDonorChange(e) {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const { errors, isValid } = validateDonationForm({ donationType, amount, donorInfo, paymentMethod });
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
        paymentMethod,
        userId:        user?.id || "",
        ...(project ? { projectId: project.id || project._id } : {}),
      });
      setSuccess(true);
      setDonationType("");
      setAmount(null);
      setPaymentMethod("cash");
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
          <h1>{project ? `تبرعك لمشروع: ${project.title}` : "ساهم في صنع الفرق"}</h1>
          <p>
            {project
              ? "أنت على وشك التبرع لمشروع محدد. سيُضاف مبلغ تبرعك مباشرة إلى رصيد المشروع."
              : "تبرعك يصل مباشرة إلى من يحتاجه. اختر نوع التبرع والمبلغ وأكمل بياناتك لنتمكن من توصيل مساهمتك بأمان."}
          </p>
        </section>

        {project && (
          <div className="dp-project-banner" dir="rtl">
            <div className="dp-project-banner-content">
              <strong>المشروع المختار:</strong> {project.title}
              {project.goal > 0 && (
                <span className="dp-project-banner-progress">
                  {" "}— تم جمع {Number(project.raised || 0).toLocaleString("ar-EG")} من أصل {Number(project.goal).toLocaleString("ar-EG")} ₪
                </span>
              )}
            </div>
            <Link to="/projects" className="dp-project-banner-clear">تغيير المشروع</Link>
          </div>
        )}
        {projectError && (
          <div className="dp-alert dp-alert-error" dir="rtl">⚠ {projectError}</div>
        )}

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

              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onChange={(val) => {
                  setPaymentMethod(val);
                  setFieldErrors((p) => ({ ...p, paymentMethod: "" }));
                }}
                error={fieldErrors.paymentMethod}
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
