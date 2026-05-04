const config = require("../config/environment");

const levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const getLevel = () => levels[config.LOG_LEVEL?.toUpperCase()] || levels.INFO;

const formatLog = (level, message, data = null) => {
  const time = new Date().toISOString();
  let msg = `[${time}] [${level}] ${message}`;

  if (data) {
    msg += ` ${JSON.stringify(data)}`;
  }

  return msg;
};

const error = (message, data) => {
  if (getLevel() >= levels.ERROR) {
    console.error(formatLog("ERROR", message, data));
  }
};

const warn = (message, data) => {
  if (getLevel() >= levels.WARN) {
    console.warn(formatLog("WARN", message, data));
  }
};

const info = (message, data) => {
  if (getLevel() >= levels.INFO) {
    console.log(formatLog("INFO", message, data));
  }
};

const debug = (message, data) => {
  if (getLevel() >= levels.DEBUG) {
    console.log(formatLog("DEBUG", message, data));
  }
};

module.exports = {
  error,
  warn,
  info,
  debug,
};
