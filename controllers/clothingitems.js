const ClothingItems = require("../models/clothingitem");
const {
  INVALID_DATA,
  INVALID_ENDPOINT,
  SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const deleteItem = (req, res) => {
  ClothingItems.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You are unauthorized to delete this item." });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item successfully deleted." }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
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
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
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
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
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
