const { userController } = require(`../controllers/index`);
const express = require(`express`);

const router = express.Router();

router.post(`/register`, userController.register);
router.post(`/login`, userController.login);
router.get(`/getuser/:id`, userController.fetchUser);

module.exports = router;
