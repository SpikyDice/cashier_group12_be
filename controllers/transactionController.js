const { db, query } = require(`../database/index`);
const format = require(`date-fns/format`);

module.exports = {
  fetchAllTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      let transactionQuery = `select * innerjoin from transaction_product`;
      res.status(200).send({ message: "Fetching works!" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  addTransactionProduct: async (req, res) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .send({ success: false, message: "No data being passed" });
      }

      const addToDatabase = async (finalDataQuery) => {
        try {
          let response = await query(finalDataQuery);
          return { success: true, response };
        } catch (error) {
          return { success: false, error };
        }
      };

      let currentDate = Date.now();
      let formattedDate = format(currentDate, "MMMM dd, yyyy");
      let checkTransactionId = `select idtransaction from transaction`;
      let getTransaction = await query(checkTransactionId);
      let totalPrice = 0;
      let userId = 0;
      // console.log(req.body);
      if (getTransaction.length !== 0) {
        let { idtransaction } = getTransaction[getTransaction.length - 1];
        let newIdTransaction = idtransaction;
        req.body.forEach(async (transaction) => {
          let finalTransactionData = {
            ...transaction,
            idtransaction: newIdTransaction,
            date: formattedDate,
          };
          let {
            idproduct,
            productName,
            category,
            quantity,
            price,
            iduser,
            idtransaction,
            date,
          } = finalTransactionData;
          let addTransactionProductQuery = `insert into transaction_product values (null, ${idtransaction}, ${idproduct}, ${quantity} )`;
          // console.log(addTransactionProductQuery);
          totalPrice += price;
          userId = iduser;
          let addToTransactionProduct = await addToDatabase(
            addTransactionProductQuery
          );
          if (addToTransactionProduct.success === false) {
            return res.status(400).send(addToTransactionProduct.error);
          }
        });
      } else {
        let idtransaction = 1;
        req.body.forEach((transaction) => {
          let finalTransactionData = {
            ...transaction,
            idtransaction,
            date: formattedDate,
          };
          console.log(finalTransactionData);
        });
      }
      // let addTransaction = await query();
      // const { SalesType, idproduct, productName, category, quantity, price } =
      //   req.body;
      // console.log(addTransactionQuery);
      return res.status(200).send({ success: true, message: "Data added" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  addTransaction: async (req, res) => {
    try {
      if (req.body.totalPrice === 0) {
        return res
          .status(400)
          .send({ success: false, message: "No data available" });
      }
      const { iduser, totalPrice } = req.body;
      let inputDate = Date.now();
      let formattedDate = format(inputDate, "MMMM dd, yyyy hh:mm:ss");
      let transactionQuery = `insert into transaction values (null, ${iduser}, ${totalPrice}, "${formattedDate}" )`;
      let addToTransaction = await query(transactionQuery);
      if (addToTransaction) {
        return res
          .status(200)
          .send({ success: true, message: "Data added", addToTransaction });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
