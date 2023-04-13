const mysql = require("mysql2");
const util = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cashier_webapp",
  port: 3306,
});

db.connect((err) => {
  if (err) console.error(`Error : ${err.message}`);
  console.log(`Connected to MySQL Server`);
});

const query = util.promisify(db.query).bind(db);

module.exports = { db, query };
