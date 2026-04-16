import { useState, useMemo } from "react";
import Navbar from "../Components/Navbar";
//import Footer from "../Components/Footer";
import Hero from "../Components/TeamWorkComp/Hero";
import SearchBar from "../Components/TeamWorkComp/SearchBar";
import TeamGrid from "../Components/TeamWorkComp/TeamGrid";

/* 🔥 الداتا هون مباشرة */
const ROLE_CONFIG = {
  administration: {
    label: "Administration",
    subtitle: "The leadership team guiding our mission and vision",
    color: "#16a34a",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
  },
  employees: {
    label: "Employees",
    subtitle: "Dedicated professionals powering our daily operations",
    color: "#3b82f6",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
  },
  doctors: {
    label: "Doctors",
    subtitle: "Medical experts delivering compassionate healthcare",
    color: "#8b5cf6",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
  },
  security: {
    label: "Security",
    subtitle: "Keeping our community safe",
    color: "#f59e0b",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  volunteers: {
    label: "Volunteers",
    subtitle: "Community heroes",
    color: "#ec4899",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

const teamMembers = [
  {
    id: "1",
    name: "Sarah Al-Hassan",
    title: "Executive Director",
    role: "administration",
    description: "Leading the organization",
    email: "sarah@test.com",
    phone: "0599111111",
    skills: ["Leadership"],
    initials: "SH",
    avatarColor: "#16a34a",
  },
  {
    id: "2",
    name: "Omar Khalil",
    title: "Operations Manager",
    role: "administration",
    description: "Managing operations",
    email: "omar@test.com",
    phone: "0599222222",
    skills: ["Management"],
    initials: "OK",
    avatarColor: "#15803d",
  },
  {
    id: "3",
    name: "Layla Mansouri",
    title: "Employee",
    role: "employees",
    description: "Daily operations",
    email: "layla@test.com",
    phone: "0599333333",
    skills: ["Office"],
    initials: "LM",
    avatarColor: "#3b82f6",
  },
  {
    id: "4",
    name: "Dr. Kareem",
    title: "Doctor",
    role: "doctors",
    description: "Healthcare services",
    email: "doc@test.com",
    phone: "0599444444",
    skills: ["Medical"],
    initials: "DK",
    avatarColor: "#8b5cf6",
  },
];

export default function TeamWork() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return teamMembers;

    return teamMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 🔥 Navbar */}
      <Navbar />

      {/* 🔥 Hero */}
      <Hero />

      <div className="max-w-7xl mx-auto mt-10">
        <SearchBar query={query} onChange={setQuery} />

        <div className="mt-12">
          <TeamGrid
            members={filtered}
            ROLE_CONFIG={ROLE_CONFIG}
            query={query}
          />
        </div>
      </div>

      
      
    </div>
  );
}