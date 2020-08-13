const router = require("express").Router();
const Post = require("../models/post");

router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({
      message: "Posts Updated successfully!",
    });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Post.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!",
      });
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((response) => {
    console.log(response);
    res.status(200).json({ message: "Post delete!" });
  });
});

module.exports = router;
