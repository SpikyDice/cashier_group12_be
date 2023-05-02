const { db, query } = require(`../database/index`);
const format = require(`date-fns/format`);
const add = require(`date-fns/add`);

module.exports = {
  fetchAllTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const currentDate = format(Date.now(), "yyyy-MM-dd");
      const sevenDaysAgo = format(add(Date.now(), { days: -7 }), "yyyy-MM-dd");
      let transactionQuery = `select transaction_product.idtransaction, product.name, category.name as category, transaction_product.quantity, product.price as pricePerPiece, transaction.totalPrice, transaction.date from transaction_product inner join transaction on transaction_product.idtransaction = transaction.idtransaction inner join product on transaction_product.idproduct = product.idproduct inner join category on product.idcategory = category.idcategory where transaction.iduser=${id} and transaction.date between "${sevenDaysAgo}" and "${currentDate}" order by transaction.idtransaction asc`;
      let result = await query(transactionQuery);
      if (result.length === 0) {
        return res
          .status(200)
          .send({ success: true, message: "No data for the past 7 days" });
      }
      return res
        .status(200)
        .send({ success: true, message: "Fetching works!", result });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  fetchTransactionOnDateRange: async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;
      // console.log(req.params);
      // console.log(req.body);
      if (!startDate && !endDate) {
        const currentDate = format(Date.now(), "yyyy-MM-dd");
        const sevenDaysAgo = format(
          add(Date.now(), { days: -7 }),
          "yyyy-MM-dd"
        );
        let transactionQuery = `select transaction_product.idtransaction, product.name, category.name as category, transaction_product.quantity, product.price as pricePerPiece, transaction.totalPrice, transaction.date from transaction_product inner join transaction on transaction_product.idtransaction = transaction.idtransaction inner join product on transaction_product.idproduct = product.idproduct inner join category on product.idcategory = category.idcategory where transaction.iduser=${id} and transaction.date between "${sevenDaysAgo}" and "${currentDate}" order by transaction.idtransaction asc`;
        let result = await query(transactionQuery);
        if (result.length === 0) {
          return res
            .status(200)
            .send({ success: true, message: "No data for the past 7 days" });
        }
        return res
          .status(200)
          .send({ success: true, message: "Fetching works!", result });
      }

      let transactionQuery = `select transaction_product.idtransaction, product.name, category.name as category, transaction_product.quantity, product.price as pricePerPiece, transaction.totalPrice, transaction.date from transaction_product inner join transaction on transaction_product.idtransaction = transaction.idtransaction inner join product on transaction_product.idproduct = product.idproduct inner join category on product.idcategory = category.idcategory where transaction.iduser=${id} and transaction.date between "${startDate}" and "${endDate}" order by transaction.idtransaction asc`;
      // res.status(200).send({ message: "fetching works!" });
      if (startDate === endDate) {
        transactionQuery = `select transaction_product.idtransaction, product.name, category.name as category, transaction_product.quantity, product.price as pricePerPiece, transaction.totalPrice, transaction.date from transaction_product inner join transaction on transaction_product.idtransaction = transaction.idtransaction inner join product on transaction_product.idproduct = product.idproduct inner join category on product.idcategory = category.idcategory where transaction.iduser=${id} and transaction.date="${startDate}" order by transaction.idtransaction asc`;
      }
      let result = await query(transactionQuery);

      if (result.length === 0) {
        return res.status(200).send({
          success: false,
          message: `No data available, display transaction for the past 7 days`,
        });
      }
      res
        .status(200)
        .send({ success: true, message: "Fetching works!", result });
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
      // let formattedDate = format(currentDate, "MMMM dd, yyyy");
      let formattedDate = format(currentDate, "yyyy-mm-dd");
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
      // let formattedDate = format(inputDate, "MMMM dd, yyyy hh:mm:ss");
      let formattedDate = format(inputDate, "yyyy-MM-dd");
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
