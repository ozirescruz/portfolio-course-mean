// mongodb user: ozires password: Dc1AB2sZODcpV1n0

const express = require("express");
const bodyParser = require("body-parser");
const db = require("mongoose");

db.connect(
  "mongodb+srv://ozires:Dc1AB2sZODcpV1n0@cluster0.qts0q.mongodb.net/angular-mean?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then(() => {
    console.log("DB up and running!");
  })
  .catch(() => {
    console.log("Error connecting DB!");
  });

const Post = require("./models/post");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((result) => {
    res.status(201).json({
      message: "Post added successfully",
      id: result._id,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((response) => {
    console.log(response);
    res.status(200).json({ message: "Post delete!" });
  });
});

module.exports = app;
