const { db, query } = require(`../database/index`);

module.exports = {
  fetchAllCategory: async (req, res) => {
    try {
      let categoryQuery = `select * from category`;
      let categoryList = await query(categoryQuery);
      if (!(categoryList.length > 0)) {
        return res
          .status(400)
          .send({ success: false, message: "No category found" });
      }
      return res.status(200).send({ success: true, categoryList });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
