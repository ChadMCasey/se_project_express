const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingitems");
const { INVALID_ENDPOINT } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(INVALID_ENDPOINT).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
