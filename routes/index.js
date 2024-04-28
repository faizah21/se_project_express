const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");
const { NOT_FOUND } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");

router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
