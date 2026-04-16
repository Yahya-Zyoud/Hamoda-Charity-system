import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

// ❌ حذفنا interface

export default function SearchBar({ query, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-2xl mx-auto px-6 -mt-6 relative z-20"
    >
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 group-focus-within:ring-2 group-focus-within:ring-green-400 transition-all duration-200" />

        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10 group-focus-within:text-green-500 transition-colors duration-200" />

        <input
          type="search"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, role, or skill..."
          className="relative z-10 w-full bg-transparent pr-12 py-4 text-slate-700 placeholder:text-slate-400 focus:outline-none text-base rounded-2xl"
          style={{ paddingLeft: "3.25rem" }}
          autoComplete="off"
        />

        {query && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full hover:bg-slate-100 transition-colors duration-150"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
}