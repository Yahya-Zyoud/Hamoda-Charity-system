import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

const BADGE_COLORS = {
  "إدارة": { bg: "rgba(24,86,255,0.88)"  },
  "دكتور": { bg: "rgba(7,202,107,0.88)"  },
  "موظف":  { bg: "rgba(14,165,233,0.88)" },
  "متطوع": { bg: "rgba(14,165,233,0.75)" },
};

const GRADIENTS = [
  "linear-gradient(135deg,#1856FF,#07CA6B)",
  "linear-gradient(135deg,#0ea5e9,#1856FF)",
  "linear-gradient(135deg,#07CA6B,#0ea5e9)",
  "linear-gradient(135deg,#1856FF,#0ea5e9)",
];

export default function TeamCard({ member, index = 0 }) {
  const badge    = BADGE_COLORS[member.role] || { bg: "#1856FF" };
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const initials = member.initials || member.name?.slice(0, 2) || "??";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(24,86,255,0.13)" }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.85)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      {/* الصورة أو الأفاتار */}
      <div
        className="w-full h-44 flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg,#dbeafe 0%,#bbf7d0 100%)" }}
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ background: gradient, border: "3px solid rgba(255,255,255,0.8)" }}
          >
            {initials}
          </div>
        )}

        {/* Badge */}
        <span
          className="absolute top-2.5 left-2.5 text-white text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: badge.bg,
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {member.role}
        </span>
      </div>

      {/* المعلومات */}
      <div className="p-4" dir="rtl">
        <h3 className="text-sm font-bold mb-0.5" style={{ color: "#0f172a" }}>
          {member.name}
        </h3>
        <p className="text-xs font-semibold mb-2" style={{ color: "#1856FF" }}>
          {member.title}
        </p>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "#64748b" }}>
          {member.description}
        </p>

        <div className="pt-3 flex flex-col gap-1.5"
          style={{ borderTop: "1px solid rgba(24,86,255,0.08)" }}>
          {member.email && (
            <a href={`mailto:${member.email}`}
              className="flex items-center justify-end gap-1.5 text-xs hover:opacity-70 transition-opacity"
              style={{ color: "#475569" }}>
              <span className="truncate max-w-[170px]">{member.email}</span>
              <Mail size={12} style={{ color: "#1856FF", flexShrink: 0 }} />
            </a>
          )}
          {member.phone && (
            <a href={`tel:${member.phone}`}
              className="flex items-center justify-end gap-1.5 text-xs hover:opacity-70 transition-opacity"
              style={{ color: "#475569" }}>
              <span>{member.phone}</span>
              <Phone size={12} style={{ color: "#1856FF", flexShrink: 0 }} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}