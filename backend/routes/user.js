const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User added successfully",
          authdata: {
            ...result,
            id: result._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth failed" });
      }

      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Auth failed" });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "FF2D7D911EAD63079AF87803C87FCD83",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token: token,
        expiresIn: "3600",
      });
    })
    .catch((error) => {
      return res.status(401).json({ message: "Auth failed" });
    });
});

module.exports = router;
