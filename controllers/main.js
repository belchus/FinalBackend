const logger = require("../utils/logger.js");
require("dotenv").config();
const { sendEmail } = require("../utils/nodemailer.js");
const { sendSMS } = require("../utils/twilioSMS.js");
const { serverInfo } = require("../public/js/info.js");
const { userFactory } = require("../repository/userFactory.js");

async function infoserver(req, res) {
  const params = {
    title: "Servidor",
    args: serverInfo().args,
    plat: serverInfo().plat,
    version: serverInfo().version,
    memoria: serverInfo().memoria,
    exe: serverInfo().exe,
    id: serverInfo().id,
    path: serverInfo().path,
    numCPUs: serverInfo().numCPUs,
  };
  res.render("info.hbs", params);
}

async function server(req, res) {
  return res.render("server.hbs", {
    PUERTO: process.env.PUERTO,
    MODO: process.env.MODO,
    //run: process.env.run,
    SECRET: process.env.SECRET,
    MONGOURL: process.env.MONGOURL,
    GMAIL_MAIL: process.env.GMAIL_MAIL,
    GMAIL_PASS: process.env.GMAIL_PASS,
    TWILIO_ACCTSID: process.env.TWILIO_ACCTSID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SENDER_NUMBER: process.env.TWILIO_SENDER_NUMBER,
    TWILIO_RECEIVER_NUMBER: process.env.TWILIO_RECEIVER_NUMBER,
    emailNotificacion: process.env.EMAIL_DESTINATION,
    expiracionSesion: process.env.COOKIE_EXPIRATION_TIME,
  });
}

async function notFound(req, res) {
  return res
    .status(404)
    .render("errorCheck.hbs", { status: 404, error: "error HTTP 404 (Not Found)" });
}

async function loginGet(req, res) {
  return res.render("login.hbs", { title: "LogIn" });
}

async function registerGet(req, res) {
  return res.render("register.hbs", { title: "Register" });
}

async function index(req, res) {
  res.render("main.hbs", {
    title: "Moon Accesorios",
    user: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    avatar: req.user.avatar,
    address: req.user.address,
    rol: req.user.admin,
    id: req.user.id,
  });
}

async function item(req, res) {
  const { id } = req.params;
  res.render("item.hbs", {
    user: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    avatar: req.user.avatar,
    address: req.user.direccion,
    rol: req.user.admin,
    id: req.user.id,
    productId: id,
  });
}

async function chatCenter(req, res) {
  const params = {
    title: " Chat online",
    user: {
      user: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      avatar: req.user.avatar,
      rol: req.user.admin,
      id: req.user.id,
    },
  };
  res.render("chat.hbs", params);
}

async function privateChat(req, res) {
  const { email } = req.params;
  const userData = await userFactory.listByMail(email);
  console.log(userData);
  const params = {
    title: "New Message",
    user: {
      user: userData.email,
      firstname: userData.firstname,
      lastname: userData.lastname,
      rol: userData.admin,
    },
  };
  res.render("privateChat.hbs", params);
}




async function notifyPurchase(data) {
  const email= "arenabelu@gmail.com";
  sendEmail(data.title, data.msg, email);
  sendSMS(data.msgSMS);
}

async function order(req, res) {
  return res.render("orders.hbs", {
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
  });
}



module.exports = {index, item, loginGet, registerGet, notFound, notifyPurchase, infoserver, chatCenter, privateChat, order, server,};
