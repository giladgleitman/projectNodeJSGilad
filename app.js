const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const register = require("./routes/register");
const login = require("./routes/login");
const userProfile = require("./routes/userProfile");
const cards = require("./routes/cards");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/userProfile", userProfile);
app.use("/api/cards", cards);

mongoose
  .connect(process.env.db, { useNewUrlParser: true })
  .then(() => console.log("connect to MongoDB..."))
  .catch(() => console.log("could not connect"));

app.listen(PORT, () => console.log("server started on port" + PORT));
