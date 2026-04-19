import { useState } from "react";
import { subscribeEmail } from "../../services/api";
import { Mailbox, CheckCircle, XCircle, Lock } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setEmailError("الرجاء إدخال البريد الإلكتروني");
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("صيغة البريد الإلكتروني غير صحيحة");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await subscribeEmail(email.trim());
      setStatus("success");
      setMessage(res.message || "تم الاشتراك بنجاح! شكراً لاهتمامك.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "حدث خطأ أثناء الاشتراك، يرجى المحاولة لاحقاً");
    }
  };

  return (
    <section
      dir="rtl"
      className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 relative z-10 text-center">

        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
       
          <Mailbox className="w-5 h-5 text-white/80" />
          <span className="text-white/90 font-bold text-sm">النشرة البريدية</span>

        </div>

        <h2 className="text-4xl font-black text-white mb-3 leading-tight">
          ابقَ على اطّلاع بآخر{" "}
          <span className="text-blue-300">مشاريعنا وأخبارنا</span>
        </h2>

        <p className="text-white/70 text-lg mb-10 leading-relaxed">
          اشترك في نشرتنا البريدية وكن أوّل من يعلم عن حملاتنا ومشاريعنا الخيرية
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-3 items-start"
        >
          <div className="flex-1 w-full">
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="أدخل بريدك الإلكتروني..."
              disabled={status === "loading"}
              dir="rtl"
              className={`w-full px-5 py-4 rounded-xl text-gray-800 text-sm font-medium bg-white/95 backdrop-blur placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-300 disabled:opacity-60
                ${emailError ? "ring-2 ring-red-400" : ""}`}
            />
            {emailError && (
              <p className="text-red-300 text-xs mt-1 text-right pr-1">
                {emailError}
              </p>
            )}

          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="sm:w-auto w-full px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 whitespace-nowrap flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <span>اشترك الآن</span>
                <span>←</span>
              </>
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 px-5 py-3 rounded-xl text-sm font-semibold transition-all
              ${status === "success"
                ? "bg-green-500/20 text-green-300 border border-green-400/30"
                : "bg-red-500/20 text-red-300 border border-red-400/30"
              }`}
          >
            <div className="flex items-center gap-2">
              {status === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {message}
            </div>
          </div>
        )}

        <p className="flex justify-center items-center gap-2 text-white/40 text-xs mt-6">
          <Lock className="w-3 h-3" />
          لن نشارك بريدك الإلكتروني مع أي جهة خارجية
        </p>
      </div>
    </section>
  );
}
