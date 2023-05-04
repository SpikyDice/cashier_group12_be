const { db, query } = require(`../database/index`);

module.exports = {
  fetchAllCategory: async (req, res) => {
    try {
      let categoryQuery = `select * from category`;
      let categoryList = await query(categoryQuery);
      if (!(categoryList.length > 0)) {
        return res.status(400).send({ success: false, message: "No category found" });
      }
      return res.status(200).send({ success: true, categoryList });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  addCategory: async (req, res) => {
    try {
      //destructuring the data
      const { userId, newCategory } = req.body;

      //look whether the category already exist or not
      let getCategoryQuery = `select * from category where name=${db.escape(newCategory)} and iduser=${db.escape(userId)}`;
      let isCategoryExist = await query(getCategoryQuery);
      if (isCategoryExist.length > 0) {
        return res.status(200).send({ success: false, message: "Category already exist" });
      }

      //if category doesn't exist, add into db
      let addCategoryQuery = `insert into category values (null, ${db.escape(userId)}, ${db.escape(newCategory)})`;
      let addCategoryResult = await query(addCategoryQuery);

      return res.status(200).send({ success: true, message: "Category added", addCategoryResult });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
