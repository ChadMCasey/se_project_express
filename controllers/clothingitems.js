const ClothingItems = require("../models/clothingitem");
const BadRequestError = require("../utils/Errors/BadRequestError");
const ForbiddenError = require("../utils/Errors/ForbiddenError");
const NotFoundError = require("../utils/Errors/NotFoundError");

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The data could not be validated"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res) => {
  ClothingItems.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError("User unauthorized to delete this item."));
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item successfully deleted." }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Data format is invalid."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Data format is invalid."));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  addLike,
  deleteLike,
};
