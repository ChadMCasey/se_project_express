const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingitems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
