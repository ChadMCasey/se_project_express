const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/:userId", getUser);
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
