import { useState } from "react";
import TeamCard from "./TeamCard";

export default function TeamGrid({ members }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {members.map((member) => (
        <TeamCard
          key={member.id}
          member={member}
          expanded={activeId === member.id}
          onToggle={() =>
            setActiveId(activeId === member.id ? null : member.id)
          }
        />
      ))}
    </div>
  );
}