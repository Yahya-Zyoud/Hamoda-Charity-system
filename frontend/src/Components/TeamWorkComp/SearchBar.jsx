// components/SearchBar.jsx
export default function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <input
        type="text"
        placeholder="Search by name, role or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
      />
    </div>
  );
}