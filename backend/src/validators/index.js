const emailValidator = require("./emailValidator");
const userValidator = require("./userValidator");

module.exports = {
  ...emailValidator,
  ...userValidator,
};
