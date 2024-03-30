const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingitems");
const { loginUser, createUser } = require("../controllers/users");
const { INVALID_ENDPOINT } = require("../utils/errors");

router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(INVALID_ENDPOINT).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
