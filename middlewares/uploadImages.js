const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.join(__dirname, "../public/images"))) {
      fs.mkdirSync(path.join(__dirname, "../public/images"));
    }
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const multerFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

const productImageResize = async (req, res, next) => {
  if (!req.files) return next();

  const outputPath = "public/images/products";

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  await Promise.all(
    req.files.map(async (file) => {
      const outputFilePath = path.join(
        outputPath,
        `${file.filename.replace(/\.[^/.]+$/, ".webp")}`
      );

      await sharp(file.path)
        .resize(500, 500)
        .toFormat("webp")
        .webp({ quality: 90 })
        .toFile(outputFilePath);
      fs.unlinkSync(outputFilePath);
    })
  );
  next();
};

const blogImageResize = async (req, res, next) => {
  if (!req.files) return next();

  const outputPath = "public/images/blogs";

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  await Promise.all(
    req.files.map(async (file) => {
      const outputFilePath = path.join(
        outputPath,
        `${file.filename.replace(/\.[^/.]+$/, ".webp")}`
      );
      await sharp(file.path)
        .resize(500, 500)
        .toFormat("webp")
        .webp({ quality: 90 })
        .toFile(outputFilePath);
      fs.unlinkSync(outputFilePath);
    })
  );
  next();
};

module.exports = { uploadPhoto, productImageResize, blogImageResize };
