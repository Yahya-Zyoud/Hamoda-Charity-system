// data/services.js
const services = [
    {
        id: 1,
        num: "01",
        name: "التحقق والشفافية",
        desc: "نضمن وصول التبرعات لمستحقيها من خلال نظام تحقق دقيق.",
        icon: "ShieldCheck"
    },
    {
        id: 2,
        num: "02",
        name: "البحث الذكي",
        desc: "نساعدك في إيجاد الحالات الأكثر حاجة بسهولة.",
        icon: "Search"
    },
    {
        id: 3,
        num: "03",
        name: "تقارير واضحة",
        desc: "نوفر تقارير مفصلة عن كل عملية تبرع.",
        icon: "FileText"
    },
    {
        id: 4,
        num: "04",
        name: "إدارة المتطوعين",
        desc: "تنظيم فرق العمل والمتطوعين بكفاءة.",
        icon: "Users"
    },
    {
        id: 5,
        num: "05",
        name: "سرعة التنفيذ",
        desc: "نضمن سرعة في إيصال المساعدات.",
        icon: "Clock"
    },
    {
        id: 6,
        num: "06",
        name: "دعم إنساني",
        desc: "نقدم الدعم للأسر المحتاجة بكل حب.",
        icon: "Heart"
    }
];

function getServices(req, res) {
    res.json(services);
}

module.exports = { getServices };