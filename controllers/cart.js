
const{errorCheck} = require ('../utils/errorCheck.js')
const {cartFactory} = require('../repository/cartFactory.js')

// controller de carrito

async function allCarts(req, res) {
  const result = await cartFactory.getallCarts();
  errorCheck(req, res, result)
}

async function cartById(req, res) {
  console.log("aaaaa")
  const result = await cartFactory.listgetById(req.params.id);
  errorCheck(req, res, result)
}

async function addCart(req, res) {
  const result = await cartFactory.addThisCart(req.body);
  errorCheck(req, res, result)
}

async function addProduct(req, res) {
  const result = await cartFactory.updateThisCart(req.body);
  errorCheck(req, res, result)
}

async function deleteCart(req, res) {
  const result = await cartFactory.deleteThisCart(req.params.id);
  errorCheck(req, res, result)
}

async function removeProductById(req, res) {
  const result = await cartFactory.deleteThisProduct(
    req.params.id,
    req.params.id_prod
  );
  errorCheck(req, res, result)
}

module.exports = {allCarts,cartById,addCart,addProduct,deleteCart,removeProductById,};
