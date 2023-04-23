const { userController } = require(`../controllers/index`);
const express = require(`express`);
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

//user route
router.post(`/register`, userController.register);
router.post(`/login`, userController.login);
router.post(`/verification`, verifyToken, userController.verification);

module.exports = router;
