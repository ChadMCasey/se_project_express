const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authorize } = require("../middlewares/auth");

router.use(authorize); // authorize all the following routes.

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
