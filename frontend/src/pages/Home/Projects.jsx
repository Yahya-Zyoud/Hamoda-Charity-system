import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getProjects } from "../../services/api";
import { ArrowLeft, Target, HeartHandshake, Droplets, Leaf, Activity, AlertTriangle, FolderOpen, ShieldCheck } from "lucide-react";

const getProjectDesign = (id) => {
  const designs = [
    { icon: Droplets, color: "from-blue-400 to-indigo-600", shadow: "shadow-blue-200" },
    { icon: HeartHandshake, color: "from-rose-400 to-red-600", shadow: "shadow-rose-200" },
    { icon: Target, color: "from-amber-400 to-orange-600", shadow: "shadow-amber-200" },
    { icon: Leaf, color: "from-emerald-400 to-teal-600", shadow: "shadow-emerald-200" },
    { icon: ShieldCheck, color: "from-purple-400 to-fuchsia-600", shadow: "shadow-purple-200" },
    { icon: Activity, color: "from-cyan-400 to-blue-600", shadow: "shadow-cyan-200" },
  ];
  return designs[id % designs.length];
};

export default function AtaaProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      const list = Array.isArray(data) ? data : [];
      setProjects(list);
      if (list.length > 0) setActiveProject(list[0]);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <section dir="rtl" className="relative py-32 bg-[#fafcfb] font-[Cairo,sans-serif] overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-50/50 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-emerald-100 shadow-sm mb-6">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-800 tracking-wide">برامجنا ومشاريعنا</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-8 leading-tight tracking-tight">
            مشاريع تصنع{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              الأثر المستدام
            </span>
          </h2>

          <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium">
            اكتشف مشاريعنا النوعية المصممة لخدمة المجتمع. تصفح القائمة لمعرفة تفاصيل كل مشروع وكن جزءاً من الحل.
          </p>
        </motion.div>

        {error && (
          <div className="flex flex-col items-center justify-center p-12 bg-red-50/80 backdrop-blur-sm rounded-3xl border border-red-100 text-center gap-5 max-w-2xl mx-auto">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-2 drop-shadow-sm" />
            <p className="text-red-700 font-bold text-xl">{error}</p>
            <button onClick={loadProjects} className="mt-2 px-8 py-3.5 bg-red-600 text-white rounded-xl text-lg font-bold shadow-md hover:bg-red-700 transition">
              المحاولة مرة أخرى
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-6 items-center p-8 bg-white/50 border border-slate-100 rounded-[2rem]">
                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-200" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-full bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-100 text-center shadow-sm max-w-2xl mx-auto">
            <FolderOpen className="w-24 h-24 text-slate-300 mb-6" />
            <p className="text-slate-500 font-bold text-xl">لا توجد مشاريع متاحة حالياً</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 flex flex-col gap-4">
              {projects.map((p, idx) => {
                const isActive = activeProject?.id === p.id;
                const design = getProjectDesign(p.id);

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setActiveProject(p)}
                    className={`group p-6 md:p-8 rounded-[2rem] transition-all duration-500 cursor-pointer border ${
                      isActive
                        ? "bg-white shadow-[0_20px_50px_rgb(0,0,0,0.06)] border-white scale-[1.02] z-10"
                        : "bg-transparent border-transparent hover:bg-white/40"
                    }`}
                  >
                    <div className="flex gap-5 md:gap-8 items-start">
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isActive
                            ? `bg-gradient-to-br ${design.color} text-white shadow-lg ${design.shadow} -translate-y-1`
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        }`}
                      >
                        <span className="font-black text-xl">{String(idx + 1).padStart(2, "0")}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-2xl font-black mb-3 transition-colors duration-300 line-clamp-1 ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}>
                          {p.title}
                        </h3>
                        <p className={`font-medium leading-relaxed transition-colors duration-300 line-clamp-2 mb-5 ${isActive ? "text-slate-600" : "text-slate-400"}`}>
                          {p.description}
                        </p>

                        <div className={`flex items-center justify-between overflow-hidden transition-all duration-500 ${isActive ? "max-h-16 opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-4"}`}>
                          <button className={`flex items-center gap-2 font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l ${design.color}`}>
                            تفاصيل إضافية{" "}
                            <ArrowLeft className="w-4 h-4 text-slate-800 rtl:-scale-x-100" />
                          </button>

                          <button className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-1 bg-gradient-to-r ${design.color}`}>
                            ساهم الآن
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-5 hidden lg:block sticky top-32">
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-[0_30px_60px_rgb(0,0,0,0.12)] border border-white/50"
                  >
                    {activeProject.image ? (
                      <img src={activeProject.image} alt={activeProject.title} className="w-full h-full object-cover" />
                    ) : (
                      (() => {
                        const design = getProjectDesign(activeProject.id);
                        const ActiveIcon = design.icon;
                        return (
                          <div className={`w-full h-full bg-gradient-to-br ${design.color} flex items-center justify-center relative p-10 text-center`}>
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTM5LjUgMEszOS41IDQwTTAgMzkuNWg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
                            <div className="w-72 h-72 bg-white/20 backdrop-blur-3xl rounded-full absolute -top-20 -right-20 animate-pulse" />
                            <div className="w-56 h-56 bg-black/10 backdrop-blur-3xl rounded-full absolute -bottom-10 -left-10" />
                            <div className="relative z-10 flex flex-col items-center justify-center">
                              <div className="w-32 h-32 mb-8 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
                                <ActiveIcon className="w-16 h-16 text-white drop-shadow-md" />
                              </div>
                              <h3 className="text-3xl font-black text-white leading-snug drop-shadow-sm">
                                {activeProject.title}
                              </h3>
                              <div className="w-12 h-1.5 bg-white/50 rounded-full mt-6 mb-4" />
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
