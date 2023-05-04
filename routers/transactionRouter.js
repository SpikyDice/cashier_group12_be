const { transactionController } = require(`../controllers/index`);
const express = require(`express`);

const router = express.Router();

router.post(
  `/addtransactionproduct`,
  transactionController.addTransactionProduct
);

router.post(`/addtransaction`, transactionController.addTransaction);
router.get(`/getalltransaction/:id`, transactionController.fetchAllTransaction);
router.post(
  `/gettransactionondate/:id`,
  transactionController.fetchTransactionOnDateRange
);
router.get(`/fetchtopproduct/:id`, transactionController.fetchTopProduct);

module.exports = router;
