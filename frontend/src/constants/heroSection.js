import { Leaf, Users, Globe2, HeartHandshake } from "lucide-react";

// On small screens the decorative circles must not collide with the
// centered hero heading. The `size` class includes a mobile-first base
// (smaller) followed by md: overrides that match the original desktop
// dimensions. The `extra` class is hidden below md to skip non-essential
// circles entirely on phones.
export const circleIconsData = [
  {
    bg: "from-green-200 via-green-100 to-teal-100",
    icon: Leaf,
    label: "نمو مستدام",
    x: "left-[3%]",
    y: "top-[6%]",
    size: "w-24 h-24 md:w-44 md:h-44",
    delay: "0s",
    color: "text-green-700",
    extra: "",
  },
  {
    bg: "from-teal-200 via-blue-100 to-cyan-100",
    icon: Users,
    label: "رعاية المسنين",
    x: "right-[2%]",
    y: "top-[8%]",
    size: "w-24 h-24 md:w-52 md:h-52",
    delay: "0.5s",
    color: "text-teal-700",
    extra: "",
  },
  {
    bg: "from-emerald-200 via-green-100 to-lime-100",
    icon: Globe2,
    label: "مجتمع أفضل",
    x: "left-[8%]",
    y: "bottom-[15%]",
    size: "w-20 h-20 md:w-36 md:h-36",
    delay: "1s",
    color: "text-emerald-700",
    extra: "hidden md:flex",
  },
  {
    bg: "from-blue-200 via-indigo-100 to-sky-100",
    icon: HeartHandshake,
    label: "دعم مستمر",
    x: "right-[6%]",
    y: "bottom-[6%]",
    size: "w-20 h-20 md:w-40 md:h-40",
    delay: "1.3s",
    color: "text-blue-700",
    extra: "hidden md:flex",
  },
];
