const ClothingItems = require("../models/clothingitem");
const {
  INVALID_DATA,
  INVALID_ENDPOINT,
  SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItems.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
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

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItems.create({ name, weather, imageUrl, owner: userId })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItems.findByIdAndRemove(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: err.message });
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
      res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else {
        res.status(INVALID_DATA).send({ message: err.message });
      }
    });
};

const deleteLikes = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res
          .status(INVALID_ENDPOINT)
          .send({ message: "Requested resource not found" });
      } else {
        res.status(INVALID_DATA).send({ message: err.message });
      }
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  addLike,
  deleteLikes,
};
