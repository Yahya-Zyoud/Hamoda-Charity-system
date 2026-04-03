// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const STATS = {
  totalDonations: 124500,
  totalProjects: 12,
  totalRequests: 34,
  totalUsers: 1240,
  pendingRequests: 8,
};

export const REQUESTS_DATA = [
  { id: "REQ-001", name: "مريم خالد",    phone: "0599123456", type: "طبي",    description: "دعم لإجراء عملية جراحية عاجلة",           hasDocuments: true,  status: "pending",  date: "2024-10-20", notes: "" },
  { id: "REQ-002", name: "يوسف أحمد",    phone: "0598765432", type: "إسكان",  description: "عائلة من 5 أفراد بلا مسكن لائق",           hasDocuments: true,  status: "pending",  date: "2024-10-19", notes: "" },
  { id: "REQ-003", name: "ليلى حسن",     phone: "0597654321", type: "غذاء",   description: "سلة غذائية شهرية لأسرة محتاجة",            hasDocuments: false, status: "approved", date: "2024-10-12", notes: "تمت الموافقة بعد التحقق" },
  { id: "REQ-004", name: "عمر سليم",     phone: "0596543210", type: "تعليم",  description: "دعم رسوم جامعية لطالب متفوق",              hasDocuments: true,  status: "rejected", date: "2024-10-10", notes: "لا يستوفي الشروط" },
  { id: "REQ-005", name: "فاطمة نور",    phone: "0595432109", type: "طبي",    description: "علاج دورة كيميائية لمريضة سرطان",          hasDocuments: true,  status: "on_hold",  date: "2024-10-09", notes: "بانتظار المستندات الإضافية" },
  { id: "REQ-006", name: "حسين علي",     phone: "0594321098", type: "إسكان",  description: "إصلاح منزل مهدد بالانهيار بعد الأمطار",   hasDocuments: false, status: "pending",  date: "2024-10-08", notes: "" },
];

export const PROJECTS_DATA = [
  { id: "PRJ-001", title: "مشروع نور للتعليم",    category: "تعليم", description: "دعم الطلاب المتفوقين بالكتب والأدوات",    target: 50000,  collected: 32000, status: "active"    },
  { id: "PRJ-002", title: "قافلة طبية متنقلة",    category: "طبي",   description: "رعاية صحية للقرى النائية عبر عيادات",     target: 80000,  collected: 80000, status: "completed" },
  { id: "PRJ-003", title: "مشروع سكن الأمل",      category: "إسكان", description: "بناء وحدات سكنية للأسر المشردة",          target: 120000, collected: 45000, status: "active"    },
  { id: "PRJ-004", title: "سلة الغذاء الشتوية",   category: "غذاء",  description: "حصص غذائية شهرية لـ 500 أسرة محتاجة",    target: 30000,  collected: 28500, status: "active"    },
];

export const DONATIONS_DATA = [
  { id: "DON-001", donor: "أحمد محمد",    email: "ahmed@mail.com",  amount: 500,  project: "مشروع نور للتعليم",  method: "بطاقة ائتمان", date: "2024-10-20", status: "completed" },
  { id: "DON-002", donor: "سارة العلي",   email: "sara@mail.com",   amount: 1200, project: "قافلة طبية متنقلة",  method: "تحويل بنكي",   date: "2024-10-19", status: "completed" },
  { id: "DON-003", donor: "خالد إبراهيم", email: "khaled@mail.com", amount: 250,  project: "سلة الغذاء الشتوية", method: "بطاقة ائتمان", date: "2024-10-18", status: "pending"   },
  { id: "DON-004", donor: "نور الدين",    email: "noor@mail.com",   amount: 3000, project: "مشروع سكن الأمل",    method: "PayPal",        date: "2024-10-17", status: "completed" },
  { id: "DON-005", donor: "متبرع مجهول",  email: "—",               amount: 750,  project: "مشروع نور للتعليم",  method: "نقدي",          date: "2024-10-15", status: "completed" },
  { id: "DON-006", donor: "رنا سعيد",     email: "rana@mail.com",   amount: 100,  project: "سلة الغذاء الشتوية", method: "بطاقة ائتمان", date: "2024-10-14", status: "failed"    },
];

export const USERS_DATA = [
  { id: "USR-001", name: "مريم خالد",    email: "maryam@mail.com", role: "user",  joined: "2024-01-15", status: "active"   },
  { id: "USR-002", name: "أحمد محمد",    email: "ahmed@mail.com",  role: "admin", joined: "2023-05-10", status: "active"   },
  { id: "USR-003", name: "سارة العلي",   email: "sara@mail.com",   role: "user",  joined: "2024-03-22", status: "active"   },
  { id: "USR-004", name: "يوسف أحمد",    email: "yousef@mail.com", role: "user",  joined: "2024-06-01", status: "inactive" },
  { id: "USR-005", name: "فاطمة نور",    email: "fatima@mail.com", role: "user",  joined: "2024-07-14", status: "active"   },
  { id: "USR-006", name: "خالد إبراهيم", email: "khaled@mail.com", role: "admin", joined: "2023-11-30", status: "active"   },
];

export const NOTIFICATIONS = [
  { id: 1, type: "request",  msg: "طلب مساعدة جديد من مريم خالد (طبي)",  time: "منذ 5 دقائق",  read: false },
  { id: 2, type: "donation", msg: "تبرع جديد بمبلغ 1200$ من سارة العلي", time: "منذ 20 دقيقة", read: false },
  { id: 3, type: "request",  msg: "طلب مساعدة جديد من حسين علي (إسكان)", time: "منذ ساعة",     read: false },
  { id: 4, type: "donation", msg: "تبرع جديد بمبلغ 3000$ من نور الدين",  time: "منذ 3 ساعات",  read: true  },
  { id: 5, type: "system",   msg: "تم استيفاء هدف مشروع القافلة الطبية", time: "أمس",           read: true  },
];

export const MONTHLY = [
  { m: "يناير",   v: 8200  }, { m: "فبراير", v: 11500 }, { m: "مارس",   v: 9800  },
  { m: "أبريل",  v: 13200 }, { m: "مايو",   v: 10500 }, { m: "يونيو",  v: 14800 },
  { m: "يوليو",  v: 12000 }, { m: "أغسطس", v: 15600 }, { m: "سبتمبر", v: 11200 },
  { m: "أكتوبر", v: 17700 },
];

export const REQUEST_DIST = [
  { type: "طبي",   count: 14, color: "#0891B2" },
  { type: "إسكان", count: 8,  color: "#16A34A" },
  { type: "غذاء",  count: 7,  color: "#D97706" },
  { type: "تعليم", count: 5,  color: "#0EA5E9" },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
export const STATUS_CFG = {
  pending:   { label: "قيد المراجعة", bg: "#FFFBEB", color: "#D97706" },
  approved:  { label: "مقبول",        bg: "#F0FDF4", color: "#16A34A" },
  rejected:  { label: "مرفوض",        bg: "#FEF2F2", color: "#DC2626" },
  on_hold:   { label: "معلق",         bg: "#ECFEFF", color: "#0891B2" },
  active:    { label: "نشط",          bg: "#F0FDF4", color: "#16A34A" },
  completed: { label: "مكتمل",        bg: "#ECFEFF", color: "#0891B2" },
  inactive:  { label: "غير نشط",      bg: "#F3F4F6", color: "#6B7280" },
  failed:    { label: "فشل",          bg: "#FEF2F2", color: "#DC2626" },
  user:      { label: "مستخدم",       bg: "#F3F4F6", color: "#6B7280" },
  admin:     { label: "مدير",         bg: "#EFF6FF", color: "#0891B2" },
};
