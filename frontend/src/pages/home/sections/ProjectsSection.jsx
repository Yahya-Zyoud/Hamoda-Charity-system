import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjects } from "../../../services/api";
import { getProjectDesign } from "../../../constants/projects";
import { ArrowLeft, Target, FolderOpen, AlertTriangle } from "lucide-react";
import { useAppAuth } from "../../../contexts/AppAuthContext";
import { isClerkConfigured } from "../../../lib/clerkConfig";
import { useClerkSignInButton } from "../../../hooks/useClerkSignInButton";
import { openDonationInquiry } from "../../../lib/contactLinks";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const { user } = useAppAuth();
  const SignInBtn = useClerkSignInButton(!user);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      const loaded = Array.isArray(data) ? data : [];
      setProjects(loaded);
      if (loaded.length > 0) setActiveProject(loaded[0]);
    } catch (err) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      dir="rtl"
      className="relative py-24 xl:py-28 bg-[#fafcfb] font-[Cairo,sans-serif] overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-50/50 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

     
      <div className="page-shell px-4 md:px-6 xl:px-8 relative z-10">
       
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 xl:mb-20 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-emerald-100 shadow-sm mb-6">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-tajawal font-bold text-emerald-700 tracking-wider">
              برامجنا ومشاريعنا
            </span>
          </div>

          <h2 className="heading-lg font-tajawal text-slate-900 mb-8 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            مشاريع تصنع الأثر المستدام
          </h2>

          <p className="text-body-lg text-gray-700 max-w-3xl mx-auto">
            اكتشف مشاريعنا الرائدة والمصممة خصيصًا لخدمة المجتمع وتحسين نوعية الحياة. تصفح القائمة لمعرفة التفاصيل الكاملة والانضمام للتغيير الحقيقي.
          </p>
        </motion.div>

        {error && (
          <div className="flex flex-col items-center justify-center p-12 bg-red-50/80 backdrop-blur-sm rounded-3xl border border-red-100 text-center gap-5 max-w-2xl mx-auto">
          
            <AlertTriangle className="w-16 h-16 text-red-500 mb-2 drop-shadow-sm" />
            <p className="text-red-700 font-bold text-xl">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-2 px-8 py-3.5 bg-red-600 text-white rounded-xl text-lg font-bold shadow-md hover:bg-red-700 transition"
            >
              المحاولة مرة أخرى
          
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-pulse">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex gap-6 items-center p-8 bg-white/50 border border-slate-100 rounded-[2rem]"
              >
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
            <p className="text-slate-500 font-bold text-xl">
              لا توجد مشاريع متاحة حالياً
            </p>
         
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
            <div className="flex flex-col gap-4">
              {projects.map((p, idx) => {
                const isActive = activeProject?.id === p.id;
                const design = getProjectDesign(p.id);

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setActiveProject(p)}
                    className={`group p-5 md:p-6 rounded-[2rem] transition-all duration-500 cursor-pointer border ${
                      isActive
                        ? "bg-white shadow-[0_20px_50px_rgb(0,0,0,0.06)] border-white scale-[1.02] z-10"
                        : "bg-transparent border-transparent hover:bg-white/40"
                    }`}
                  >
                    <div className="flex gap-4 md:gap-6 items-start">
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isActive
                            ? `bg-gradient-to-br ${design.color} text-white shadow-lg ${design.shadow} -translate-y-1`
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        }`}
                      >
                        <span className="font-black text-xl">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3
                          className={`text-2xl font-black mb-3 transition-colors duration-300 line-clamp-1 ${
                            isActive
                              ? "text-slate-900"
                              : "text-slate-600 group-hover:text-slate-800"
                          }`}
                        >
                          {p.title}
                        </h3>
                        <p
                          className={`font-medium leading-relaxed transition-colors duration-300 line-clamp-2 mb-5 ${
                            isActive ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          {p.description}
                        </p>

                        <div
                          className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between overflow-hidden transition-all duration-500 ${
                            isActive
                              ? "max-h-16 opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 translate-y-4"
                          }`}
                        >
                          <button
                            className={`flex items-center gap-2 font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l ${design.color}`}
                          >
                            تفاصيل إضافية{" "}
                            <ArrowLeft
                              className={`w-4 h-4 text-slate-800 rtl:-scale-x-100`}
                            />
                          </button>

                          {user || !isClerkConfigured || !SignInBtn ? (
                            <button
                              type="button"
                              onClick={() => openDonationInquiry(p.title)}
                              className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-1 bg-gradient-to-r ${design.color}`}
                            >
                              ساهم الآن
                            </button>
                          ) : (
                            <SignInBtn mode="modal">
                              <button className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-1 bg-gradient-to-r ${design.color}`}>
                                ساهم الآن
                              </button>
                            </SignInBtn>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block sticky top-28 self-start">
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.06)] min-h-[32rem] flex flex-col"
                  >
                    {activeProject.image ? (
                      <img
                        src={activeProject.image}
                        alt={activeProject.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      (() => {
                        const activeDesign = getProjectDesign(activeProject.id);
                        const ActiveIcon = activeDesign.icon;

                        return (
                          <div className={`relative min-h-[18rem] bg-gradient-to-br ${activeDesign.color} overflow-hidden flex items-center justify-center`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
                            <div className="absolute top-6 right-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />
                            <div className="relative z-10 flex flex-col items-center text-white text-center px-6">
                              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/30 bg-white/12 backdrop-blur-sm">
                                <ActiveIcon className="h-12 w-12" />
                              </div>
                              <div className="text-2xl font-black leading-tight">
                                {activeProject.title}
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    )}

                    <div className="p-8 flex flex-1 flex-col">
                      <h3 className="text-2xl font-black text-slate-900 mb-4">
                        {activeProject.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {activeProject.description}
                      </p>

                      {activeProject.details && (
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                          {activeProject.details}
                        </p>
                      )}

                      {user || !isClerkConfigured || !SignInBtn ? (
                        <button
                          type="button"
                          onClick={() => openDonationInquiry(activeProject?.title)}
                          className="mt-auto w-full py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                          ساهم الآن
                        </button>
                      ) : (
                        <SignInBtn mode="modal">
                          <button className="mt-auto w-full py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                            ساهم الآن
                          </button>
                        </SignInBtn>
                      )}
                    </div>
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
