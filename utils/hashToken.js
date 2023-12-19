const crypto = require("crypto");

const createHashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = createHashToken;
