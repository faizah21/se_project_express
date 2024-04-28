const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");

router.use(handleAuthorization);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
