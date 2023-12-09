const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8080;
const dbConnect = require("./config/dbConnect");

// DB Connection
dbConnect();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
