import TeamCard from "./TeamCard";

const SECTIONS = [
  { key: "إدارة",  label: "الإدارة",    sub: "قيادة ذات خبرة واسعة في العمل الخيري والتنموي"   },
  { key: "دكتور",  label: "الأطباء",    sub: "كوادر طبية متميزة في خدمة المجتمع"                },
  { key: "موظف",   label: "الموظفون",   sub: "فريق متخصص ومتفاني لتنفيذ البرامج والمشاريع"     },
  { key: "متطوع",  label: "المتطوعون",  sub: "قلوب تنبض بالعطاء والتضامن الإنساني"             },
];

export default function TeamGrid({ members }) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-20 text-sm" style={{ color: "#94a3b8" }}>
        لا يوجد أعضاء مطابقون للبحث
      </div>
    );
  }

  // تجميع الأعضاء حسب الدور
  const grouped = {};
  members.forEach((m) => {
    const key = m.role || "أخرى";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  // الأدوار الإضافية غير الموجودة في SECTIONS
  const extraKeys = Object.keys(grouped).filter(
    (k) => !SECTIONS.find((s) => s.key === k)
  );

  const allSections = [
    ...SECTIONS.filter((s) => grouped[s.key]),
    ...extraKeys.map((k) => ({ key: k, label: k, sub: "" })),
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 pb-16 pt-8 space-y-12" dir="rtl">
      {allSections.map((section) => (
        <section key={section.key}>
          {/* عنوان القسم */}
          <div
            className="flex items-center gap-3 mb-6 pb-3"
            style={{
              borderBottom: "2px solid transparent",
              borderImage: "linear-gradient(90deg,transparent,#1856FF,#07CA6B) 1",
            }}
          >
            {/* الشريط الملوّن */}
            <div
              className="w-1 h-6 rounded-full shrink-0"
              style={{ background: "linear-gradient(180deg,#1856FF,#07CA6B)" }}
            />
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: "#0f172a" }}>
                {section.label}
              </h2>
              {section.sub && (
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  {section.sub}
                </p>
              )}
            </div>
          </div>

          {/* الكروت */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {grouped[section.key].map((member, idx) => (
              <TeamCard
                key={member._id || member.id}
                member={member}
                index={idx}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}