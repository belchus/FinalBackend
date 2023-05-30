const express = require ('express')
const router = express.Router()
const {auth, notAuth} = require ('../utils/authModules.js')


const cart = require('../controllers/cart.js')


router.get("/", auth, cart.allCarts);

router.get("/:id/products", auth, cart.cartById);

router.post("/", auth, cart.addCart);

router.post("/:id/products", auth, cart.addProduct);

router.delete("/:id", notAuth, cart.deleteCart);

router.delete("/:id/products/:id_prod", auth, cart.removeProductById);

module.exports = router;