const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/auth.route");
const bodyParser = require("body-parser");

// DB Connection
dbConnect();

// Middleware

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/user", authRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
