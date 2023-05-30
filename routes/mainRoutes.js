
const express = require("express");
const router = express.Router();
const passport = require("passport");
const main = require("../controllers/main.js");
const { auth, notAuth } = require("../utils/authModules.js");


router.get("/", notAuth, main.loginGet);
router.get("/products", auth, main.index); 
router.get("/products/:id", auth, main.item);
router.post(
  "/login",
  notAuth,
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/info", main.infoserver);

router.get("/register", notAuth, main.registerGet);

router.post("/purchase",notAuth , (req, res) => {
  main.notifyPurchase(req.body);
});
router.get("/exit", (req, res) => {
  req.logout();
  return res.redirect("/");
});
router.get("/logout", auth, (req, res) => {
  res.render("logout.hbs", {
    firstname: req.user.firstname,
    title: "Logout",
  });
});

//rutas del canal de chat
router.get("/chat", auth, main.chatCenter);
router.get("/chat/:email", main.privateChat);

//ruta para visualizar las órdenes(para frontend)
router.get('/orders', auth, main.order)

//ruta para visualizar la configuración del servidor (frontend)
router.get('/server', auth, main.server)


module.exports = router;
