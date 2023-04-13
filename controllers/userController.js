const { db, query } = require(`../database/index`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

module.exports = {
  register: async (req, res) => {
    try {
      const { name, password, email, address } = req.body;
      let getEmailQuery = `select * from users where email=${db.escape(email)}`;

      let isEmailExist = await query(getEmailQuery);
      console.log(isEmailExist);

      if (isEmailExist.length > 0) {
        return res
          .status(400)
          .send({ status: false, detail: "Email already exist" });
      }

      let hashpassword = await bcrypt.hash(password, 10);
      let addUserQuery = `insert into users values (null, ${db.escape(
        name
      )}, ${db.escape(hashpassword)}, ${db.escape(email)}, ${db.escape(
        address
      )}, 0, 0)`;

      query(addUserQuery, (err, result) => {
        if (err) {
          return res.status(400).send({ status: false, result });
        }
        return res.status(200).send({ status: true, result });
      });
    } catch (error) {
      return res.status(200).send({ error });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let userEmailQuery = `select * from users where email = ${db.escape(
        email
      )}`;
      let isEmailExist = await query(userEmailQuery);
      if (!(isEmailExist.length > 0)) {
        return res
          .status(400)
          .send({ status: false, message: "Email not exist" });
      }

      let validator = await bcrypt.compare(password, isEmailExist[0].password);
      if (!validator) {
        return res
          .status(400)
          .send({ success: false, message: "Password not match" });
      }

      let payload = {
        id: isEmailExist[0].iduser,
        isAdmin: isEmailExist[0].isAdmin,
      };

      const token = jwt.sign(payload, "meong", { expiresIn: "1h" });

      return res.status(400).send({ token, success: true });
    } catch (error) {
      return res.status(400).send(error);
    }

    // bcrypt.compare(password)
  },
  fetchUser: async (req, res) => {
    console.log(req.params);
  },
};
