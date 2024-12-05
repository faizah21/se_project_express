const router = require("express").Router();

const NotFoundError = require("../errors/notFoundError");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser } = require("../controllers/users");
const { login } = require("../controllers/users");
const authorize = require("../middlewares/auth");
const {
  validateUserCreation,
  validateUserAuthentication,
} = require("../middlewares/validation");

router.use("/users", authorize, userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserAuthentication, login);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found."));
});

module.exports = router;
