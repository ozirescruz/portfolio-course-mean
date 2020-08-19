const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("mongoose");

const postsRouter = require("./routes/post");
const usersRouter = require("./routes/user");

db.connect(
  "mongodb+srv://ozires:Dc1AB2sZODcpV1n0@cluster0.qts0q.mongodb.net/angular-mean?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
)
  .then(() => {
    console.log("DB up and running!");
  })
  .catch(() => {
    console.log("Error connecting DB!");
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

module.exports = app;
