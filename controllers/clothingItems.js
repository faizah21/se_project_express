const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../errors/notFoundError");
const ValidationError = require("../errors/validationError");
const ForbiddenError = require("../errors/forbiddenError");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch(next);
};

const getItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ValidationError("Invalid data entered"));
      }
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid data entered"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      const ownerId = clothingItem?.owner.toString();

      if (!(currentUserId === ownerId)) {
        return next(new ForbiddenError("You do not own this item."));
      }

      return ClothingItem.findByIdAndDelete(itemId).then((item) => {
        res.send({ message: `deleted item with ID: ${item._id}` });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid data entered."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: user },
    },
    {
      new: true,
    }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid data entered"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const user = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $pull: { likes: user },
    },
    {
      new: true,
    }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new ValidationError("Invalid data entered."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
