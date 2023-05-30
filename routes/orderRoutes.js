const express = require("express");
const router = express.Router();
const {auth} = require ('../utils/authModules.js')
const order = require('../controllers/order.js')

//Rutas para traer y listar las ordenes de compra
router.get("/", auth, order.allOrders);

router.get("/:email", auth, order.listByMail);

router.post("/", auth, order.saveOrder);

module.exports = router