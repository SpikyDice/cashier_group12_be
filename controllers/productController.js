const { db, query } = require(`../database/index`);

module.exports = {
  fetchAllProduct: async (req, res) => {
    try {
      let queryProduct = `select idproduct, category.name as category, product.name as name, price from product left join category on product.idcategory = category.idcategory`;
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
      const { userId, productName, productCategory, productPrice, productStock } = req.body;

      //look whether the category already exist or not
      let getProductQuery = `select * from product where name=${db.escape(productName)} and iduser=${db.escape(userId)}`;
      let isProductExist = await query(getProductQuery);
      if (isProductExist.length > 0) {
        return res.status(200).send({ success: false, message: "Product already exist" });
      }

      //if category doesn't exist:

      //get category's id
      let categoryIdQuery = `select idcategory from category where name=${db.escape(productCategory)}`;
      let categoryId = await query(categoryIdQuery);
      categoryId = Object.values(categoryId[0])[0];

      //add into db
      let addProductQuery = `insert into product values (null, ${db.escape(categoryId)}, ${db.escape(userId)}, ${db.escape(productName)}, ${db.escape(productPrice)}, ${db.escape(productStock)})`;
      let addProductResult = await query(addProductQuery);

      return res.status(200).send({ success: true, message: "Product added", addProductResult });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
