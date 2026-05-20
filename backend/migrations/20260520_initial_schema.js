module.exports = {
  async up(db) {
    // Normalize project status from Arabic to English values
    await db.collection("projects").updateMany(
      { status: "نشط" },
      { $set: { status: "active" } }
    );
    await db.collection("projects").updateMany(
      { status: "مكتمل" },
      { $set: { status: "completed" } }
    );
    await db.collection("projects").updateMany(
      { status: "معلق" },
      { $set: { status: "on_hold" } }
    );

    // Normalize user role default from Arabic to English
    await db.collection("users").updateMany(
      { role: "متبرع" },
      { $set: { role: "donor" } }
    );

    // Normalize donation types from Arabic to English
    const typeMap = {
      "صدقة": "sadaqah",
      "زكاة": "zakat",
      "إغاثة": "relief",
      "إسكان": "housing",
      "علاج": "medical",
      "تعليم": "education",
    };
    for (const [ar, en] of Object.entries(typeMap)) {
      await db.collection("donations").updateMany(
        { donationType: ar },
        { $set: { donationType: en } }
      );
    }
  },

  async down(db) {
    await db.collection("projects").updateMany({ status: "active" },    { $set: { status: "نشط" } });
    await db.collection("projects").updateMany({ status: "completed" }, { $set: { status: "مكتمل" } });
    await db.collection("projects").updateMany({ status: "on_hold" },   { $set: { status: "معلق" } });
    await db.collection("users").updateMany(   { role: "donor" },       { $set: { role: "متبرع" } });
  },
};
