const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gozalidonny@gmail.com",
    pass: "ktzvnotycqygzmph",
  },
});

module.exports = transporter;
