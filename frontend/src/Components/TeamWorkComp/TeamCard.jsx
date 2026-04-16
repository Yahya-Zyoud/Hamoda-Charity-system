import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, RotateCcw } from "lucide-react";

/* ROLE CONFIG */
const ROLE_CONFIG = {
  administration: {
    label: "Administration",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
  },
  employees: {
    label: "Employees",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  doctors: {
    label: "Doctors",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
  },
  security: {
    label: "Security",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  volunteers: {
    label: "Volunteers",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

export default function TeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const roleConfig = ROLE_CONFIG[member.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-80 cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="h-full relative">
        <div
          className={`transition-transform duration-500 h-full ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >

          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-2xl bg-white border border-slate-100 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            }}
          >
            <div
              className="relative h-32 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${member.avatarColor}22 0%, ${member.avatarColor}44 100%)`,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: member.avatarColor }}
              >
                {member.initials}
              </div>

              <span
                className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full border ${roleConfig.badgeColor}`}
              >
                {roleConfig.label}
              </span>

              <div className="absolute top-3 left-3">
                <RotateCcw className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {member.name}
              </h3>

              <p className="text-slate-500 text-sm mb-2">
                {member.title}
              </p>

              <p className="text-slate-600 text-sm line-clamp-3">
                {member.description}
              </p>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-2xl text-white"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              background: `linear-gradient(145deg, ${member.avatarColor} 0%, ${member.avatarColor}cc 100%)`,
            }}
          >
            <div className="p-6 h-full flex flex-col">

              <div className="mb-4">
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-white/80 text-sm">{member.title}</p>
              </div>

              {/* CONTACT */}
              <div className="flex flex-col gap-2 mb-4">

                <a
                  href={`mailto:${member.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </a>

                <a
                  href={`tel:${member.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </a>

              </div>

              {/* SKILLS */}
              <div className="mt-auto">
                <p className="text-white/60 text-xs mb-2">Skills</p>

                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-white/20 px-2 py-1 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}