const { db, query } = require(`../database/index`);

module.exports = {
  fetchAllProduct: async (req, res) => {
    try {
      let queryProduct = `select category.name as category, product.name as name, price from product left join category on product.idcategory = category.idcategory`;
      let allProduct = await query(queryProduct);
      if (!(allProduct.length > 0)) {
        return res
          .status(400)
          .send({ status: false, message: "No product found" });
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
        return res
          .status(400)
          .send({ status: false, message: "No Product Name" });
      }
      const { name } = req.body;
      let queryProduct = `select * from product where name = ${db.escape(
        name
      )}`;
      let isProductExist = await query(queryProduct);
      if (!(isProductExist.length > 0)) {
        return res
          .status(400)
          .send({ status: false, message: "No product found" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
