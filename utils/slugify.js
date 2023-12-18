const slugify = require("slugify");

const slugifyTitle = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
  });
};

module.exports = slugifyTitle;
