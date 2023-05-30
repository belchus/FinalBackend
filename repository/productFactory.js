const productMongo = require("../DAO/productMongo.js");
const productFileSystem = require("../DAO/productFileSystem.js");
const model = require("../models/productModel.js");
const file = "../db/product.txt";
const { run } = require("../server.js");
const DTO = require ('../DTOS/productDTO.js')

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
      return new Repository(file);
    } else if (type === "prod") {
      return new Repository(model);
    }
  };
  class Repository extends (extention
    ? productFileSystem
    : productMongo) {
    constructor(source) {
      super(source);
    }
    async listAll() {
      const data = await this.getAll();
      const dtoResponse = new DTO(data)
      return dtoResponse.allProducts();
    }
    async productById(id) {
      const data = await this.getById(id);
      const dtoResponse = new DTO(data)
      return dtoResponse.product();
    }

    async listByMongoId(id) {
      const data = await this.getByMongo(id);
      const dtoResponse = new DTO(data)
      return dtoResponse.product();
    }

    async listByCategory(category) {
      const data = await this.getByCategory(category);
      const dtoResponse = new DTO(data)
      return dtoResponse.allProducts();
    }
    async Categories(){
      const data = await this.getCategories()
      return data
    }  
    async save(product) {
      const data = await this.saveProduct(product);
      return data;
    }
    async update(product, id) {
      const data = await this.updateProduct(product, id);
      return data;
    }
    async delete(id) {
      const data = await this.deleteById(id);
      return data;
    }
  }
}

var productFactory = new factoryRepository(run).createRepository();

module.exports = { productFactory };
