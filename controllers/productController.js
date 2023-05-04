const { db, query } = require(`../database/index`);

module.exports = {
  fetchAllProduct: async (req, res) => {
    try {
      let queryProduct = `select idproduct, imagePath, category.name as category, product.name as name, price, stock from product left join category on product.idcategory = category.idcategory`;
      let allProduct = await query(queryProduct);
      if (!(allProduct.length > 0)) {
        return res.status(400).send({ status: false, message: "No product found" });
      }
      // console.log(allProduct);
      return res.status(200).send({ success: true, allProduct });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  fetchSpecificProduct: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).send({ status: false, message: "No Product Name" });
      }
      const { name } = req.body;
      let queryProduct = `select * from product where name = ${db.escape(name)}`;
      let isProductExist = await query(queryProduct);
      if (!(isProductExist.length > 0)) {
        return res.status(400).send({ status: false, message: "No product found" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  addProduct: async (req, res) => {
    try {
      //destructuring the data
      const { idProduct, userId, productName, productCategory, productPrice, productStock } = req.body;

      // //look whether the category already exist or not
      // let getProductQuery = `select * from product where idproduct=${db.escape(idProduct)}`;
      // let isProductExist = await query(getProductQuery);
      // if (isProductExist.length == 0) {
      //   return res.status(200).send({ success: false, message: "Product doesn't exist" });
      // }

      //get category's id
      let categoryIdQuery = `SELECT idcategory
          FROM category
          WHERE name=${db.escape(productCategory)}`;
      let categoryId = await query(categoryIdQuery);
      categoryId = Object.values(categoryId[0])[0];

      //create path for product image

      const { file } = req;
      const imagePath = file ? "/" + file.filename : null;

      console.log(req.file);
      console.log(imagePath);
      //update db
      let updateProductQuery = `INSERT INTO product
          VALUES
          (
          null,
          ${db.escape(userId)},
          ${db.escape(imagePath)},
          ${db.escape(productName)},
          ${db.escape(categoryId)},
          ${db.escape(productPrice)},
          ${db.escape(productStock)}
          )
          `;
      console.log(updateProductQuery);
      let updateProductResult = await query(updateProductQuery);

      return res.status(200).send({ success: true, message: "Product updated", updateProductResult });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  updateProduct: async (req, res) => {
    try {
      //destructuring the data
      const { idProduct, userId, productName, productCategory, productPrice, productStock } = req.body;

      //look whether the category already exist or not
      let getProductQuery = `select * from product where idproduct=${db.escape(idProduct)}`;
      let isProductExist = await query(getProductQuery);
      if (isProductExist.length == 0) {
        return res.status(200).send({ success: false, message: "Product doesn't exist" });
      }

      //get category's id
      let categoryIdQuery = `SELECT idcategory
      FROM category
      WHERE name=${db.escape(productCategory)}`;
      let categoryId = await query(categoryIdQuery);
      categoryId = Object.values(categoryId[0])[0];

      //create path for product image

      const { file } = req;
      const imagePath = file ? "/" + file.filename : null;

      console.log(req.file);
      console.log(imagePath);
      //update db
      let updateProductQuery = `UPDATE product
      SET
      imagePath = ${db.escape(imagePath)},
      name = ${db.escape(productName)},
      idcategory = ${db.escape(categoryId)},
      price = ${db.escape(productPrice)},
      stock = ${db.escape(productStock)}
      WHERE idproduct = ${db.escape(idProduct)}
      `;
      let updateProductResult = await query(updateProductQuery);

      return res.status(200).send({ success: true, message: "Product updated", updateProductResult });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).send({ status: false, message: "No Product Name" });
      }
      const { name } = req.body;
      let queryProduct = `DELETE * from product where name = ${db.escape(name)}`;
      let isProductExist = await query(queryProduct);
      if (!(isProductExist.length == 0)) {
        return res.status(200).send({ status: true, message: "Product deleted" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
