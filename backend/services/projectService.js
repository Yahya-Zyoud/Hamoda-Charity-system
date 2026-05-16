/* =============================================
   اسم الملف: projectService.js
   الوظيفة: يحتوي على منطق العمل الخاص بالمشاريع الخيرية
   يتعامل مع قاعدة البيانات لجلب وإنشاء وتعديل وحذف المشاريع
   ============================================= */

// نستورد الـ Model للتعامل مع مجموعة المشاريع في قاعدة البيانات
const Project      = require("../models/Project");

// statsService لإلغاء الـ cache عند كل تغيير يؤثر على الإحصائيات
const statsService = require("./statsService");

/**
 * getProjects — يُعيد كل المشاريع مرتّبة من الأحدث للأقدم
 *
 * @returns {Promise<Project[]>} - مصفوفة المشاريع
 */
exports.getProjects = async () =>
  Project.find().sort({ createdAt: -1 });

/**
 * getProjectById — يُعيد مشروعاً واحداً بمعرّفه
 *
 * @param {string} id - معرّف المشروع (MongoDB ObjectId)
 * @returns {Promise<Project|null>} - المشروع أو null إذا لم يُوجد
 */
exports.getProjectById = async (id) =>
  Project.findById(id);

/**
 * getProjectStats — يُعيد إحصائيات المشاريع للوحة التحكم
 * يستخدم Promise.all لتشغيل الاستعلامات الثلاثة بالتوازي (أسرع)
 *
 * @returns {Promise<{total: number, active: number, completed: number}>}
 */
exports.getProjectStats = async () => {
  // نُشغّل الاستعلامات الثلاثة بالتوازي لتوفير الوقت
  const [total, active, completed] = await Promise.all([
    Project.countDocuments(),                      // إجمالي كل المشاريع
    Project.countDocuments({ status: "نشط" }),     // المشاريع النشطة
    Project.countDocuments({ status: "مكتمل" }),   // المشاريع المكتملة
  ]);
  return { total, active, completed };
};

/* --- قائمة الحقول المسموح بإرسالها من الفرونتيند --- */
// هذا لمنع Mass Assignment Attack: حيث يُرسل المستخدم حقولاً غير مقصودة
// مثلاً: لا نريد أن يُرسل أحد { raised: 999999 } مباشرة
const ALLOWED_CREATE_FIELDS = ["title", "description", "details", "category", "status", "goal", "beneficiaries", "image", "location", "startDate", "endDate", "tags", "manager", "logoType"];
const ALLOWED_UPDATE_FIELDS = [...ALLOWED_CREATE_FIELDS]; // نفس القائمة للتحديث

/**
 * pick — دالة مساعدة تُعيد كائناً يحتوي فقط على المفاتيح المسموحة
 * تُزيل أي حقول إضافية غير متوقعة من البيانات المُرسَلة
 *
 * @param {Object} obj - الكائن الأصلي (req.body مثلاً)
 * @param {string[]} keys - قائمة المفاتيح المسموحة
 * @returns {Object} - كائن يحتوي فقط على المفاتيح المسموحة
 */
function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}

/**
 * createProject — يُنشئ مشروعاً جديداً في قاعدة البيانات
 * يُصفّي البيانات أولاً باستخدام pick() قبل الحفظ
 *
 * @param {Object} data - بيانات المشروع الجديد
 * @returns {Promise<Project>} - المشروع المُنشأ
 */
exports.createProject = async (data) => {
  const safe = pick(data, ALLOWED_CREATE_FIELDS); // نأخذ الحقول المسموحة فقط
  const project = await Project.create(safe);
  statsService.invalidateCache(); // نُلغي الـ cache لأن عدد المشاريع تغيّر
  return project;
};

/**
 * updateProject — يُحدّث بيانات مشروع موجود
 * new: true → يُعيد المشروع بعد التحديث وليس قبله
 * runValidators: true → يُطبّق قواعد الـ Schema عند التحديث
 *
 * @param {string} id - معرّف المشروع
 * @param {Object} data - البيانات الجديدة
 * @returns {Promise<Project|null>} - المشروع المُحدَّث أو null إذا لم يُوجد
 */
exports.updateProject = async (id, data) => {
  const safe = pick(data, ALLOWED_UPDATE_FIELDS);
  const project = await Project.findByIdAndUpdate(id, safe, { new: true, runValidators: true });
  statsService.invalidateCache(); // نُلغي الـ cache لأن بيانات المشروع تغيّرت
  return project;
};

/**
 * deleteProject — يحذف مشروعاً من قاعدة البيانات
 *
 * @param {string} id - معرّف المشروع
 * @returns {Promise<Project|null>} - المشروع المحذوف أو null إذا لم يُوجد
 */
exports.deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);
  statsService.invalidateCache(); // نُلغي الـ cache لأن عدد المشاريع تغيّر
  return project;
};
