const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const dbConnect = require("./config/dbConnect");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const morgan = require("morgan");

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

// Home Route
app.get("/", (req, res) => res.send("Hello World!"));

// Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
