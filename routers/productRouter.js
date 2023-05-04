const { productController } = require(`../controllers/index`);
const express = require("express");

//multer
const upload = require("../middleware/multer");

const router = express.Router();

router.get(`/productlist`, productController.fetchAllProduct);
router.post(`/addNewProduct`, upload.single("productImage"), productController.addProduct);
router.post(`/updateProduct`, upload.single("productImage"), productController.updateProduct);
router.delete(`/deleteProduct`, productController.deleteProduct);

module.exports = router;
