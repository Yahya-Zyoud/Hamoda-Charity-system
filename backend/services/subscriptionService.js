const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");

const isDBReady = () => mongoose.connection.readyState === 1;

exports.subscribe = async (email) => {
  const cleanEmail = email.trim().toLowerCase();
  if (!isDBReady()) return { email: cleanEmail };
  await Subscription.create({ email: cleanEmail });
  return { email: cleanEmail };
};
