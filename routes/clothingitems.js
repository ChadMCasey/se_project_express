const itemRouter = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingitems");

itemRouter.get("/", getItems);
itemRouter.post("/", createItem);
itemRouter.delete("/:itemId", deleteItem);
itemRouter.put("/:itemId/likes", addLike);
itemRouter.delete("/:itemId/likes", deleteLike);

module.exports = itemRouter;
