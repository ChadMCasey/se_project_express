const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingitems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// we create a catch all
// function that allows us to account for all other
// routes
router.use((req, res) => {
  res.status(INVALID_ENDPOINT).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
