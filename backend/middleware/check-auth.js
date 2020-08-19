const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "FF2D7D911EAD63079AF87803C87FCD83");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
