const express = require ('express')
const router = express.Router()
const {auth} = require ('../utils/authModules.js')
const prod = require('../controllers/product.js')


//Rutas para el manejo de productos
router.get("/",  prod.listAll);

router.get("/:id", auth, prod.productById);

router.get("/mongo/:id", auth, prod.listByMongoId);

router.post("/", auth, prod.createProduct);

router.put("/:id", auth, prod.modifyProduct);

router.delete("/:id", auth, prod.deleteProduct);

module.exports = router;