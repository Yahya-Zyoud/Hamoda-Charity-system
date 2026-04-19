const stats = [
  {
    id: 1,
    icon: "Users",
    value: 5000,
    suffix: "+",
    label: "مستفيد",
    sublabel: "من مختلف المناطق",
  },
  {
    id: 2,
    icon: "FolderKanban",
    value: 120,
    suffix: "+",
    label: "مشروع منجز",
    sublabel: "في التعليم والصحة والبنية",
  },
  {
    id: 3,
    icon: "HeartHandshake",
    value: 850,
    suffix: "K",
    label: "ريال تبرعات",
    sublabel: "وصلت للمحتاجين مباشرة",
  },
  {
    id: 4,
    icon: "Globe",
    value: 8,
    suffix: "",
    label: "سنوات خبرة",
    sublabel: "في العمل الخيري والإنساني",
  },
];

exports.getStats = (req, res) => {
  res.json({ success: true, data: stats });
};
