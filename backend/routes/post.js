const router = require("express").Router();
const Post = require("../models/post");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const postController = require("../controllers/post");

// ****************************************
router.post("", checkAuth, extractFile, postController.createPost);

// *******************************************
router.put("/:id", checkAuth, extractFile, postController.updatePost);

// ************************************************
router.get("/:id", postController.postById);

// ************************************************
router.get("", postController.allPosts);

// ************************************************
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
