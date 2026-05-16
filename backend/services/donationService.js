/* =============================================
   اسم الملف: donationService.js
   الوظيفة: يحتوي على منطق العمل الخاص بالتبرعات
   الـ Service يُفصل منطق العمل (Business Logic) عن الـ Controller
   الـ Controller يستقبل الطلب → يُمرّره للـ Service → يُعيد الرد
   ============================================= */

// نستورد الـ Models للتعامل مع قاعدة البيانات
const Donation     = require("../models/Donation");
const Project      = require("../models/Project");
const Notification = require("../models/Notification");

// statsService لإلغاء الـ cache بعد كل عملية تغيير في البيانات
const statsService = require("./statsService");

// logger لتسجيل التحذيرات
const logger       = require("../utils/logger");

/**
 * createDirectDonation — يُنشئ سجل تبرع جديد في قاعدة البيانات
 * وينشئ إشعاراً للأدمن بشكل "fire-and-forget" (لا ننتظر نجاحه)
 * لماذا fire-and-forget؟ حتى لا يُعطَّل التبرع إذا فشل إنشاء الإشعار
 *
 * @param {Object} params - بيانات التبرع
 * @param {string} params.donationType - نوع التبرع
 * @param {number} params.amount - المبلغ
 * @param {string} params.donorName - اسم المتبرع
 * @param {string} params.donorEmail - إيميل المتبرع
 * @param {string} params.donorPhone - هاتف المتبرع (اختياري)
 * @param {string} params.donorCity - مدينة المتبرع (اختياري)
 * @param {string} params.paymentMethod - طريقة الدفع
 * @param {string} params.userId - معرّف Clerk (فارغ إذا تبرع بدون تسجيل)
 * @param {string} params.projectId - معرّف المشروع المرتبط (اختياري)
 * @param {string} params.note - ملاحظة إضافية (اختيارية)
 * @returns {Promise<Donation>} - سجل التبرع المُنشأ
 */
exports.createDirectDonation = async ({ donationType, amount, donorName, donorEmail, donorPhone, donorCity, paymentMethod, userId, projectId, note }) => {
  // نُنشئ سجل التبرع في قاعدة البيانات
  const donation = await Donation.create({
    donationType,
    amount:        Number(amount),                          // نتأكد من كونه رقماً
    donorName:     donorName.trim(),                        // نُزيل المسافات
    donorEmail:    donorEmail.trim().toLowerCase(),          // أحرف صغيرة للتوحيد
    donorPhone:    (donorPhone || "").trim(),               // اختياري
    donorCity:     (donorCity  || "").trim(),               // اختياري
    paymentMethod: paymentMethod || "cash",
    status:        "pending",                               // يبدأ بانتظار موافقة الأدمن
    userId:        userId || "",
    ...(projectId && { projectId }),                        // نُضيفه فقط إذا كان موجوداً
    note:          (note || "").trim(),
  });

  // نُنشئ إشعاراً للأدمن — fire-and-forget (لا نُوقف عند الفشل)
  Notification.create({
    type:      "donation",
    msg:       `تبرع جديد بمبلغ $${donation.amount} من ${donation.donorName} (${donation.donationType})`,
    relatedId: donation._id,
  }).catch((err) => logger.warn("Failed to create donation notification", { error: err.message }));

  // نُلغي الـ cache لأن الإحصائيات تغيّرت
  statsService.invalidateCache();
  return donation;
};

/**
 * getAllDonations — يُعيد كل التبرعات مرتّبة من الأحدث للأقدم
 * limit(200) لمنع إعادة آلاف السجلات دفعة واحدة
 * populate يجلب عنوان المشروع المرتبط بدل مجرد الـ ID
 *
 * @returns {Promise<Donation[]>} - مصفوفة التبرعات
 */
exports.getAllDonations = async () =>
  Donation.find().sort({ createdAt: -1 }).limit(200).populate("projectId", "title");

/**
 * getDonationById — يُعيد تبرعاً واحداً بمعرّفه
 *
 * @param {string} id - معرّف التبرع (MongoDB ObjectId)
 * @returns {Promise<Donation|null>} - التبرع أو null إذا لم يُوجد
 */
exports.getDonationById = async (id) =>
  Donation.findById(id).populate("projectId", "title");

/**
 * updateDonationStatus — يُحدّث حالة التبرع ويُزامن project.raised
 *
 * قواعد المزامنة لمنع التكرار في الحساب:
 *  - التغيير إلى "accepted":   نزيد raised بمقدار amount
 *  - التغيير من "accepted":    نُنقص raised بمقدار amount (لا يقل عن صفر)
 *  - أي تغيير آخر (pending↔rejected): لا تغيير في raised
 *
 * @param {string} id - معرّف التبرع
 * @param {string} status - الحالة الجديدة (pending|accepted|rejected)
 * @returns {Promise<Donation|null>} - التبرع المُحدَّث أو null إذا لم يُوجد
 */
exports.updateDonationStatus = async (id, status) => {
  // نتحقق من صحة الحالة المُرسَلة
  const VALID = ["pending", "accepted", "rejected"];
  if (!status || !VALID.includes(status)) {
    const err = new Error(`الحالة يجب أن تكون: ${VALID.join(" | ")}`);
    err.status = 400;
    throw err;
  }

  // نجلب التبرع الحالي لمعرفة حالته القديمة قبل التحديث
  const existing = await Donation.findById(id);
  if (!existing) return null;

  // نحفظ الحالة القديمة والجديدة لمعرفة ما إذا تغيّرت حالة القبول
  const wasAccepted    = existing.status === "accepted";
  const becomesAccepted = status === "accepted";

  // نُحدّث الحالة في قاعدة البيانات
  const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

  // نُزامن project.raised إذا كان التبرع مرتبطاً بمشروع
  if (donation.projectId) {
    if (becomesAccepted && !wasAccepted) {
      // أصبح مقبولاً → نزيد المبلغ المجموع للمشروع
      await Project.findByIdAndUpdate(donation.projectId, { $inc: { raised: donation.amount } });
    } else if (!becomesAccepted && wasAccepted) {
      // كان مقبولاً وأصبح غير مقبول → نُنقص المبلغ (ونضمن عدم السالبية)
      // نستخدم aggregation pipeline لأن $max لا يعمل مع update العادي
      await Project.findByIdAndUpdate(donation.projectId, [
        { $set: { raised: { $max: [0, { $subtract: ["$raised", donation.amount] }] } } },
      ]);
    }
  }

  // نُلغي الـ cache لأن الإحصائيات تغيّرت
  statsService.invalidateCache();
  return donation;
};

/**
 * deleteDonation — يحذف تبرعاً وإذا كان مقبولاً يُعيد تعديل project.raised
 *
 * @param {string} id - معرّف التبرع
 * @returns {Promise<Donation|null>} - التبرع المحذوف أو null إذا لم يُوجد
 */
exports.deleteDonation = async (id) => {
  const donation = await Donation.findById(id);
  if (!donation) return null;

  // إذا كان التبرع مقبولاً، نُعيد المبلغ للمشروع قبل الحذف
  if (donation.status === "accepted" && donation.projectId) {
    await Project.findByIdAndUpdate(donation.projectId, [
      { $set: { raised: { $max: [0, { $subtract: ["$raised", donation.amount] }] } } },
    ]);
  }

  // نحذف التبرع من قاعدة البيانات
  await Donation.findByIdAndDelete(id);
  statsService.invalidateCache();
  return donation;
};

/**
 * getRecentDonations — يُعيد أحدث التبرعات لعرضها في واجهة الموقع
 * يستبعد المرفوضة ويُعيد بيانات مُنسَّقة جاهزة للعرض
 *
 * @param {number} limit - عدد التبرعات المطلوبة (افتراضي 6، أقصى 50)
 * @returns {Promise<Object[]>} - مصفوفة تبرعات مُنسَّقة للعرض
 */
exports.getRecentDonations = async (limit = 6) => {
  // نضمن أن الـ limit رقم صحيح بين 1 و 50
  const safeLimit = Math.min(Number(limit) || 6, 50);
  const donations = await Donation.find({ status: { $ne: "rejected" } })
    .sort({ createdAt: -1 })
    .limit(safeLimit)
    .select("donorName donationType amount paymentMethod createdAt"); // نجلب الحقول الضرورية فقط

  // نُحوّل البيانات لشكل مناسب للعرض في الفرونتيند
  return donations.map((d) => ({
    id:            d._id,
    name:          d.donorName,
    type:          d.donationType,
    paymentMethod: d.paymentMethod,
    amount:        `$${Number(d.amount).toLocaleString()}`, // نُنسّق الرقم مع رمز العملة
    date:          d.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }),
  }));
};

/**
 * getDonationStats — يحسب إجمالي التبرعات وعدد المتبرعين
 * يحسب فقط من التبرعات المقبولة (status: "accepted")
 *
 * @returns {Promise<Object>} - { totalAmount, totalDonors, totalAmountFormatted }
 */
exports.getDonationStats = async () => {
  // نستخدم aggregate لحساب المجاميع بكفاءة في MongoDB
  const result = await Donation.aggregate([
    { $match: { status: "accepted" } },                          // فلتر: المقبولة فقط
    { $group: { _id: null, totalAmount: { $sum: "$amount" }, totalDonors: { $sum: 1 } } }, // نجمع الكل
  ]);
  // إذا لم تكن هناك تبرعات مقبولة، نُعيد أصفاراً
  const stats = result[0] || { totalAmount: 0, totalDonors: 0 };
  return {
    totalAmount:          stats.totalAmount,
    totalDonors:          stats.totalDonors,
    totalAmountFormatted: `$${Number(stats.totalAmount).toLocaleString()}`, // مع التنسيق
  };
};
