import { motion } from "framer-motion";
import { Users } from "lucide-react";
import TeamCard from "./TeamCard";

const ROLE_CONFIG = {
  administration: {
    label: "Administration",
    subtitle: "Leadership team",
    color: "#16a34a",
  },
  employees: {
    label: "Employees",
    subtitle: "Daily operations",
    color: "#3b82f6",
  },
  doctors: {
    label: "Doctors",
    subtitle: "Medical team",
    color: "#8b5cf6",
  },
  security: {
    label: "Security",
    subtitle: "Safety team",
    color: "#f59e0b",
  },
  volunteers: {
    label: "Volunteers",
    subtitle: "Community support",
    color: "#ec4899",
  },
};

const ROLE_ORDER = ["administration", "employees", "doctors", "security", "volunteers"];

export default function TeamGrid({ members, query }) {

  if (!members.length) {
    return (
      <div className="text-center py-20">
        <Users className="mx-auto mb-4 text-slate-300" size={40} />
        <p>No results for "{query}"</p>
      </div>
    );
  }

  const grouped = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = members.filter((m) => m.role === role);
    return acc;
  }, {
    administration: [],
    employees: [],
    doctors: [],
    security: [],
    volunteers: [],
  });

  return (
    <div className="space-y-12 px-6 pb-20">
      {ROLE_ORDER.map((role) => {
        const group = grouped[role];
        if (!group.length) return null;

        const config = ROLE_CONFIG[role];

        return (
          <section key={role}>
            
            <div className="flex items-center mb-6 gap-3">
              <div className="w-1 h-8 rounded" style={{ background: config.color }} />
              <h2 className="text-xl font-bold">{config.label}</h2>
              <span className="text-sm text-slate-400">{group.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {group.map((member, i) => (
                <TeamCard key={member.id} member={member} index={i} />
              ))}
            </div>

          </section>
        );
      })}
    </div>
  );
}