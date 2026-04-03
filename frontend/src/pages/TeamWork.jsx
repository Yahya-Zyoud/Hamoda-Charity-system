import { useState } from "react";
import Hero from "../components/TeamWorkComp/Hero";
import Stats from "../components/TeamWorkComp/Stats";
import SearchBar from "../components/TeamWorkComp/SearchBar";
import TeamGrid from "../components/TeamWorkComp/TeamGrid";

export default function TeamWork() {
  const [search, setSearch] = useState("");

  const team = [
    {
      id: 1,
      name: "Dr. Layla Hassan",
      role: "Doctor",
      description: "Specializes in emergency care.",
      email: "layla@email.com",
    },
    {
      id: 2,
      name: "Omar Al-Farsi",
      role: "Admin",
      description: "Manages outreach programs.",
      email: "omar@email.com",
    },
    {
      id: 3,
      name: "Nour Khalil",
      role: "Volunteer",
      description: "Supports education initiatives.",
      email: "nour@email.com",
    },
  ];

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero />
      <Stats />
      <SearchBar search={search} setSearch={setSearch} />
      <TeamGrid members={filtered} />
    </div>
  );
}