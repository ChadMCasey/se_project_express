const router = require("express").Router();
const User = require("../models/user");
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/:userId", getUser);
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
