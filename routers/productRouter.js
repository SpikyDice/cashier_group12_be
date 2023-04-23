const { productController } = require(`../controllers/index`);
const express = require("express");

const router = express.Router();

router.get(`/productlist`, productController.fetchAllProduct);

module.exports = router;
