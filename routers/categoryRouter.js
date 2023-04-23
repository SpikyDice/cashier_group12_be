const { categoryController } = require(`../controllers/index`);

const express = require(`express`);

const router = express.Router();

router.get(`/categorylist`, categoryController.fetchAllCategory);

module.exports = router;
