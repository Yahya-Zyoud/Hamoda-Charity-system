import { AnimatePresence } from "framer-motion";
import TeamCard from "./TeamCard";

export default function TeamGrid({ members }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AnimatePresence>
        {members.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </AnimatePresence>
    </div>
  );
}