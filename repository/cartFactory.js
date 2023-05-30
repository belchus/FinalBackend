const cartMongo = require("../DAO/cartMongo");
const cartFileSystem = require("../DAO/cartFileSystem");
const model = require("../models/cartModel.js");
const archivo = "./db/cart.txt";
const { run } = require("../server.js");
const DTO = require('../DTOS/cartDTO.js')

let extention = null;
if (run === "dev") {
  extention = true;
}
if (run === "prod") {
  extention === false;
}

function factoryRepository(type) {
  this.createRepository = function () {
    if (type === "dev") {
      return new Repository(archivo);
    } else if (type === "prod") {
      return new Repository(model);
    }
  };
  class Repository extends (extention ? cartFileSystem : cartMongo) {
    constructor(source) {
      super(source);
    }
    async getallCarts() {
      const data = await this.getCarts();
      const dtoResponse = new DTO(data)
      return dtoResponse.allCarts();
    }
    async listgetById(id) {
      const data = await this.getById(id);
      console.log(data)
      const dtoResponse = new DTO(data)
      return dtoResponse.Cart();
    }
    async addThisCart(payload) {
      const data = await this.saveCart(payload);
      return data;
    }
    async updateThisCart(payload) {
      const data = await this.addToCart(payload);
      return data;
    }
    async deleteThisCart(id) {
      const data = await this.deleteCart(id);
      return data;
    }
    async deleteThisProduct(idUser, idProd) {
      const data = await this.deleteFromProduct(idUser, idProd);
      return data;
    }
  }
}

var cartFactory = new factoryRepository(run).createRepository();

module.exports = { cartFactory };
