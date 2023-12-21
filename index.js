const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const dbConnect = require("./config/dbConnect");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Import Routes
const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const blogRouter = require("./routes/blog.route");
const categoryRouter = require("./routes/category.route");
const blogCategory = require("./routes/blogCategory.route");

// DB Connection
dbConnect();

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/v1/user", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/blog-category", blogCategory);

// Home Route
app.get("/", (req, res) => res.send("Welcome to Digitic E-Commerce API"));

// Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
