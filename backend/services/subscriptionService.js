const Subscription = require("../models/Subscription");

exports.subscribe = async (email) => {
  const cleanEmail = email.trim().toLowerCase();
  await Subscription.create({ email: cleanEmail });
  return { email: cleanEmail };
};
