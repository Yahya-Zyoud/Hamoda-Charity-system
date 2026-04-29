import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStories } from "../../../services/api";
import {
  BookOpen,
  AlertTriangle,
  Calendar,
  Tag,
  X,
  Heart,
} from "lucide-react";

export default function StoriesSection() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeFilter, setActiveFilter] = useState("الكل");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await getStories();
        setStories(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
        setError("فشل في تحميل القصص");
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const categories = [
    "الكل",
    ...new Set(stories.map((s) => s.category).filter(Boolean)),
  ];

  const filteredStories =
    activeFilter === "الكل"
      ? stories
      : stories.filter((s) => s.category === activeFilter);

  const featuredStory = filteredStories[0];

  const getCategoryColor = (category) => {
    const colors = {
      default: "from-blue-500 to-blue-600",
      "أفضل يتيماً في فلسطين": "from-pink-500 to-red-500",
      "مشروع إصلاح بيوت الفقراء": "from-green-500 to-emerald-600",
      "دار الرجاء": "from-purple-500 to-indigo-600",
      "قصة نجاح": "from-amber-500 to-orange-600",
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <section dir="rtl" className="py-24 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-gray-50">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
           
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
           
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse" />
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 animate-pulse h-96 border border-gray-100" />
          
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 animate-pulse border border-gray-100"
                />
              ))}
            </div>
        
          </div>
        </div>
     
      </section>
    );
  }

  if (error) {
    return (
      <section dir="rtl" className="py-24 px-4 sm:px-8 md:px-16">
        <div className="max-w-7xl mx-auto">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-600" size={40} />
            <p className="text-red-700 text-lg">{error}</p>
         
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="stories" dir="rtl" className="py-16 xl:py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-gray-50">
      <div className="page-shell">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 xl:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-6">
            <BookOpen className="text-blue-600" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 mb-3">
            قصص الأمل والتغيير
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            شهادات حقيقية من أشخاص تأثروا بمشاريعنا وأفضلوا حياتهم بفضل دعمكم
          </p>
        </motion.div>

        {featuredStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 xl:mb-12"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className={`bg-gradient-to-r ${getCategoryColor(featuredStory.category)} p-1`}>
                <div className="bg-white rounded-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 xl:gap-8 items-stretch p-6 md:p-8 xl:p-10">
                    {/* Text Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="flex flex-col justify-center"
                    >
                      <div className="inline-flex items-center gap-2 mb-4 w-fit">
                        <Heart className="text-red-500" size={18} />
                        <span className="text-sm font-bold text-red-600">
                          القصة المميزة
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                        {featuredStory.title}
                      </h3>

                      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                        {featuredStory.shortDescription}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-blue-600" />
                          <span>
                            {new Date(featuredStory.date).toLocaleDateString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                        {featuredStory.category && (
                          <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-full">
                            {featuredStory.category}
                          </span>
                        )}
                        {featuredStory.tag && (
                          <div className="flex items-center gap-2">
                            <Tag size={18} className="text-amber-500" />
                            <span className="font-semibold text-amber-600">
                              {featuredStory.tag}
                            </span>
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedStory(featuredStory)}
                        className="mt-8 w-fit px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        عرض القصة
                      </motion.button>
                    </motion.div>

                    {/* Image/Icon Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className={`bg-gradient-to-br ${getCategoryColor(
                        featuredStory.category
                      )} rounded-xl p-10 xl:p-12 flex items-center justify-center min-h-[16rem] xl:min-h-[18rem]`}
                    >
                      <div className="text-center text-white">
                        <BookOpen size={80} className="mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-semibold opacity-90">
                          قصة ملهمة
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 mb-8 xl:mb-10 justify-center"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveFilter(cat);
                  }}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeFilter === cat
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        {filteredStories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredStories.slice(1).map((story, index) => (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedStory(story)}
                  className="group cursor-pointer h-full"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all min-h-[13rem] h-full flex flex-col">
                    {/* Top colored border */}
                    <div
                      className={`h-1 bg-gradient-to-r ${getCategoryColor(
                        story.category
                      )}`}
                    />

                    <div className="p-6 flex flex-col h-full">
                      {/* Category badge */}
                      {story.category && (
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 w-fit group-hover:bg-blue-100 transition">
                          {story.category}
                        </span>
                      )}

                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                        {story.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
                        {story.shortDescription}
                      </p>

                      {/* Footer */}
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={14} />
                          <span>
                            {new Date(story.date).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                        {story.tag && (
                          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Tag size={12} />
                            {story.tag}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-500 text-lg">
              لا توجد قصص في هذه الفئة حالياً
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`bg-gradient-to-r ${getCategoryColor(
                  selectedStory.category
                )} p-8 text-white relative`}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-6 left-6 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition"
                >
                  <X size={24} />
                </motion.button>

                <div className="pl-12">
                  {selectedStory.category && (
                    <span className="inline-block bg-white bg-opacity-25 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                      {selectedStory.category}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {selectedStory.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="font-semibold">
                      {new Date(selectedStory.date).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  {selectedStory.tag && (
                    <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-semibold">
                      <Tag size={18} />
                      {selectedStory.tag}
                    </div>
                  )}
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedStory.description || selectedStory.content || selectedStory.shortDescription}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStory(null)}
                  className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition w-full"
                >
                  إغلاق
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
