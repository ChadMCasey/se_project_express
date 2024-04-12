const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingitems");
const { loginUser, createUser } = require("../controllers/users");
const NotFoundError = require("../utils/Errors/NotFoundError");
const {
  validateUserLogin,
  validateUserRegister,
} = require("../middlewares/validation");

router.post("/signup", validateUserRegister, createUser);
router.post("/signin", validateUserLogin, loginUser);

// reroute to userRouter or itemRouter
router.use("/users", userRouter);
router.use("/items", itemRouter);

// matching endpoint was not identifed
router.use((req, res, next) => {
  next(new NotFoundError("The requested resource was not found."));
});

module.exports = router;
