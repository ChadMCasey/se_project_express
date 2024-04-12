const itemRouter = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {
  validateItemID,
  validateCardBody,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingitems");

itemRouter.get("/", getItems);

itemRouter.use(authorize); // authorize all the following.

itemRouter.post("/", validateCardBody, createItem);
itemRouter.delete("/:itemId", validateItemID, deleteItem);
itemRouter.put("/:itemId/likes", validateItemID, addLike);
itemRouter.delete("/:itemId/likes", validateItemID, deleteLike);

module.exports = itemRouter;
