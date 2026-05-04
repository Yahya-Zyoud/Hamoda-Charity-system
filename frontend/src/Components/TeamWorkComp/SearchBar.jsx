export default function SearchBar({ search, setSearch }) {
  return (
    <div className="max-w-xl mx-auto px-5 mt-8" dir="rtl">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(24,86,255,0.2)",
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="#1856FF" strokeWidth="2"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="ابحث بالاسم أو الدور أو الوصف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "#1e293b", fontFamily: "inherit" }}
        />
      </div>
    </div>
  );
}