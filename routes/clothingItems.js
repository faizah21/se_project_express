const router = require("express").Router();
const {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const authorize = require("../middlewares/auth");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(authorize);

router.get("/:itemId", getItem);

router.post("/", validateClothingItem, createItem);

router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
