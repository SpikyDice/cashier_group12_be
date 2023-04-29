const { categoryController } = require(`../controllers/index`);

const express = require(`express`);

const router = express.Router();

router.get(`/categorylist`, categoryController.fetchAllCategory);
router.post(`/addNewCategory`, categoryController.addCategory);

module.exports = router;
