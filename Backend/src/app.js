const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRouter);  // this line redirect all the request with /api/auth to the auth.routes.js

module.exports = app;