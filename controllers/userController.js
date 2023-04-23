const { db, query } = require(`../database/index`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const nodemailer = require(`../helper/nodemailer`);

module.exports = {
  register: async (req, res) => {
    //destructuring the data
    const { name, password, email, phone, storeName } = req.body;

    //look whether the email exist or not
    let getEmailQuery = `select * from users where email=${db.escape(email)}`;
    let isEmailExist = await query(getEmailQuery);
    if (isEmailExist.length > 0) {
      return res.status(400).send({ message: "Email already exist" });
    }

    //if email don't exist then starts hashing the password
    let hashpassword = await bcrypt.hash(password, 10);

    //insert user data into sql user database
    let addUserQuery = `insert into users values (null, ${db.escape(
      name
    )}, ${db.escape(hashpassword)}, ${db.escape(email)}, ${db.escape(storeName)}
      , ${db.escape(phone)}, 0, 0)`;
    let addUserResult = await query(addUserQuery);

    let payload = {
      id: addUserResult.insertId,
    };
    const token = jwt.sign(payload, "meong", { expiresIn: "4h" });

    let mail = {
      from: "Admin <gozalidonny@gmail.com>",
      to: `${email}`,
      subject: "Account Registration",
      html: `<div>
      <p>Click here for verification</p>
      <a href="http://localhost:3000/user/verification/${token}">Click here</a>
      </div>`,
    };

    let response = await nodemailer.sendMail(mail);

    return res
      .status(200)
      .send({ data: addUserResult, message: "Register Success" });
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

      if (!isEmailExist[0].isVerified) {
        return res
          .status(400)
          .send({ status: false, message: "Please verified your account!" });
      }

      let validator = await bcrypt.compare(password, isEmailExist[0].password);
      if (!validator) {
        return res
          .status(400)
          .send({ success: false, message: "Password does not match" });
      }

      let payload = {
        id: isEmailExist[0].iduser,
        isAdmin: isEmailExist[0].isAdmin,
      };

      const token = jwt.sign(payload, "meong", { expiresIn: "1h" });

      return res.status(200).send({
        token,
        success: true,
        data: {
          id: isEmailExist[0].iduser,
          name: isEmailExist[0].name,
          email: isEmailExist[0].email,
          storeName: isEmailExist[0].storeName,
          phone: isEmailExist[0].phone,
        },
      });
    } catch (error) {
      return res.status(400).send(error);
    }

    // bcrypt.compare(password)
  },
  // fetchUser: async (req, res) => {
  //   try {
  //     if (!req.params.id) {
  //       res.send(400).status({ success: false, message: "No ID entered" });
  //     }
  //     const id = parseInt(req.params.id);
  //     let userQuery = `select * from users where iduser = ${db.escape(id)}`;
  //     let isUserExist = await query(userQuery);
  //     if (!(isUserExist.length > 0)) {
  //       res.send(400).status({ success: false, message: "User not found" });
  //     }
  //     console.log(isUserExist);
  //   } catch (error) {
  //     res.send(400).status(error);
  //   }
  // },
  verification: async (req, res) => {
    try {
      const id = req.user.id;
      console.log(req.user);
      let updateActiveQuery = `update users set isVerified = true where iduser = ${db.escape(
        id
      )}`;
      let updateResponse = await query(updateActiveQuery);
      return res
        .status(200)
        .send({ success: true, message: "Account is verified" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
