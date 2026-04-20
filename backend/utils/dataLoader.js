const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
  try {
    const filePath = path.join(__dirname, `../data/${filename}.json`);
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading data from ${filename}.json:`, error);
    return [];
  }
};

const saveData = (filename, data) => {
  try {
    const filePath = path.join(__dirname, `../data/${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error saving data to ${filename}.json:`, error);
    return false;
  }
};

module.exports = {
  loadData,
  saveData,
};
