const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const { authorize } = require("../middleware/auth");

router.use(authorize); // authorize all the following routes.

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
