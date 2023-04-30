const { productController } = require(`../controllers/index`);
const express = require("express");

const router = express.Router();

router.get(`/productlist`, productController.fetchAllProduct);
router.post(`/addNewProduct`, productController.addProduct);

module.exports = router;
