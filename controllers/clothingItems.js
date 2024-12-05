const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const JWT_SECRET = require("../utils/config");

const DuplicateEmailError = require("../errors/duplicateEmailError");
const ValidationError = require("../errors/validationError");
const UnauthorizedError = require("../errors/unauthorizedError");
const NotFoundError = require("../errors/notFoundError");
const User = require("../models/user");

function createUser(req, res, next) {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateEmailError("Please use a different email");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        avatar: user.avatar || "default avatar image",
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Invalid data sent"));
      }
      if (err.name === "InvalidEmailError") {
        return next(
          new DuplicateEmailError("Please try a different email address.")
        );
      }
      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError("Invalid data entered"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
}

function getCurrentUser(req, res, next) {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
}

function updateUser(req, res, next) {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { $set: { name, avatar } },
    { runValidators: true, new: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid data entered"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      if (err.name === "ValidationError") {
        return next(new ValidationError("Invalid data entered"));
      }
      return next(err);
    });
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
