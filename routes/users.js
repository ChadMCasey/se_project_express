const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authorize } = require("../middlewares/auth");
const { validateUserProfileData } = require("../middlewares/validation");

router.use(authorize); // authorize all the following routes.

router.get("/me", getCurrentUser);
router.patch("/me", validateUserProfileData, updateProfile);

module.exports = router;
