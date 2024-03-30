const itemRouter = require("express").Router();
const { authorize } = require("../middleware/auth");

const {
  getItems,
  createItem,
  deleteItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingitems");

itemRouter.get("/", getItems);

itemRouter.use(authorize); // authorize all the following.

itemRouter.post("/", createItem);
itemRouter.delete("/:itemId", deleteItem);
itemRouter.put("/:itemId/likes", addLike);
itemRouter.delete("/:itemId/likes", deleteLike);

module.exports = itemRouter;
