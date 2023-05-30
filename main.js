const fs = require("fs");
const logger = require('./utils/logger.js')

async function fileCheck(file) {
  if (!fs.existsSync(file)) {
    try {
      await fs.promises.writeFile(file, "[]");
    } catch (error) {
      logger.error("ERROR ", error);
    }
  }
}

var userOnline = 0;

module.exports = {fileCheck, userOnline };
