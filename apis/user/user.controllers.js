const User = require("../../db/models/User");
const bcrypt = require("bcrypt");
const { JWT_EXPIRATION_MS, JWT_SECRET } = require("../../config/keys");
const jwt = require("jsonwebtoken");

// const generateToken = () => {};

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    const payload = {
      _id: newUser._id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res) => {
  console.log("exports.signin -> req", req.user);
  const payload = {
    _id: req.user._id,
    username: req.user.username,
    exp: Date.now() + JWT_EXPIRATION_MS,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  res.json({ token });
};
