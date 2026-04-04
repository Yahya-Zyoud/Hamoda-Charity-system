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
      initials: "LH",
      role: "Doctor",
      details: "Specializes in emergency care.",
      fullBio: "Experienced doctor helping patients in critical situations.",
      email: "layla@email.com",
      experience: "8 years",
      location: "Palestine",
    },
    {
      id: 2,
      name: "Omar Al-Farsi",
      initials: "OF",
      role: "Admin",
      details: "Manages outreach programs.",
      fullBio: "Expert in organizing and managing charity operations.",
      email: "omar@email.com",
      experience: "5 years",
      location: "UAE",
    },
    {
      id: 3,
      name: "Nour Khalil",
      initials: "NK",
      role: "Volunteer",
      details: "Supports education initiatives.",
      fullBio: "Passionate about helping children and communities.",
      email: "nour@email.com",
      experience: "3 years",
      location: "Jordan",
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