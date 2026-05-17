// Static about page — describes the charity's mission, vision, values, and target audience
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./about/AboutUs.css";

function AboutUs() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <span className="about-badge">من نحن</span>
          <h1>جمعية حمودة الخيرية</h1>
          <p>
            منصة خيرية إلكترونية تهدف إلى تنظيم العمل الخيري، وتسهيل وصول
            المساعدة إلى المحتاجين بطريقة واضحة وآمنة وموثوقة.
          </p>
        </section>

        <section className="about-container">
          <div className="about-card about-intro">
            <h2>عن المنصة</h2>
            <p>
              تم إنشاء هذه المنصة لتكون حلقة وصل بين المحتاجين، المتبرعين،
              المتطوعين، وإدارة الجمعية. تساعد المنصة في استقبال طلبات المساعدة،
              عرض المشاريع الخيرية، وتنظيم التبرعات بشكل أفضل.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <span className="about-icon">🎯</span>
              <h3>رسالتنا</h3>
              <p>
                تسهيل تقديم المساعدة لمستحقيها من خلال نظام إلكتروني واضح يقلل
                الجهد اليدوي ويساعد الإدارة في متابعة الطلبات.
              </p>
            </div>

            <div className="about-card">
              <span className="about-icon">🌍</span>
              <h3>رؤيتنا</h3>
              <p>
                بناء منصة خيرية موثوقة تزيد من الشفافية والثقة بين الجمعية
                والمجتمع والمتبرعين.
              </p>
            </div>

            <div className="about-card">
              <span className="about-icon">🤝</span>
              <h3>قيمنا</h3>
              <p>
                نؤمن بالثقة، الشفافية، التعاون، والإنسانية كأساس لأي عمل خيري
                ناجح ومستمر.
              </p>
            </div>
          </div>

          <section className="audience-section">
            <h2>من تخدم المنصة؟</h2>
            <div className="audience-list">
              <div>
                <h3>المحتاجون</h3>
                <p>إرسال طلبات المساعدة وإرفاق المستندات المطلوبة.</p>
              </div>
              <div>
                <h3>المتبرعون</h3>
                <p>اختيار المشاريع أو الحالات ودعمها بطريقة واضحة.</p>
              </div>
              <div>
                <h3>المتطوعون</h3>
                <p>المشاركة في الأنشطة والمبادرات الخيرية.</p>
              </div>
              <div>
                <h3>إدارة الجمعية</h3>
                <p>مراجعة الطلبات، إدارة المشاريع، ومتابعة التبرعات.</p>
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutUs;
