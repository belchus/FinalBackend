const fs = require("fs");
const main = require("../main.js");
const logger = require("../utils/logger.js");
const mongoModel = require('../models/productModel.js')
const MongoDao = require ('../DAO/productMongo.js')
const idFinder = new MongoDao(mongoModel) 

module.exports = class Container {
  constructor(file) {
    this.file = file;
  }

  async getAll() {
    await main.fileCheck(this.file);
    try {
      const file = await fs.promises.readFile(this.file, "utf-8");
      const data = JSON.parse(file);
      return data;
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }

  async getById(id) {
    await main.fileCheck(this.file);
    try {
      const file = await fs.promises.readFile(this.file, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((product) => product.id == id);
      return data[index] || { error: "el producto no existe" };
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }

  async getByMongo(id){
    await main.fileCheck(this.file);
    try {
      const data = await idFinder.getByMongo(id)
      if(data.kind) {
        return { error: "el producto no existe" };
      } else {
        return data
      }
    } catch (error) {
      logger.error(error)
      return {error: error}
    }
  }

  async saveProduct(object) {
    await main.fileCheck(this.file);
    try {
      const file = await fs.promises.readFile(this.file, "utf-8");
      const data = JSON.parse(file);
      const ids = data.map((product) => product.id);
      const idMaximo = Math.max(...ids);
      if (!object.title) {
        return {
          error: "este campo es obligatorio",
        };
      } else if (!object.price) {
        return { error: "este campo es obligatorio" };
      } else if (!object.code) {
        return { error: "este campo es obligatorio" };
      } else if (!object.thumbnail) {
        return { error: "este campo es obligatorio" };
      } else if (!object.stock) {
        return { error: "este campo es obligatorio" };
      } else if (!object.description) {
        return { error: "este campo es obligatorio" };
      } else if (idMaximo == -Infinity) {
        object.id = 1;
        object.timestamp = Date.now();
        data.push(object);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(data, null, 2)
        );
        return add;
      } else {
        const idMaximo = Math.max(...ids);
        object.id = idMaximo + 1;
        object.timestamp = Date.now();
        data.push(object);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(data, null, 2)
        );
        return object;
      }
    } catch (error) {
      logger.error("ERROR ", error);
      return { error: error };
    }
  }
  async updateProduct(object, id) {
    await main.fileCheck(this.file);
    try {
      const file = await fs.promises.readFile(this.file, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((product) => product.id == id);
      if (index == -1) {
        return { error: "producto no encontrado" };
      } else if (!object.title) {
        return { error: "este campo es obligatorio" };
      } else if (!object.price) {
        return { error:"este campo es obligatorio" };
      } else if (!object.code) {
        return { error: "este campo es obligatorio" };
      } else if (!object.thumbnail) {
        return { error: "este campo es obligatorio"};
      } else if (!object.stock) {
        return { error:"este campo es obligatorio"};
      } else if (!object.description) {
        return { error: "este campo es obligatorio" };
      } else {
        object.id = data[index].id;
        object.timestamp = data[index].timestamp;
        data.splice(index, 1, object);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }
  async deleteById(number) {
    await main.fileCheck(this.file);
    try {
      const file = await fs.promises.readFile(this.file, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((product) => product.id == number);
      if (index == -1) {
        return { error: "el producto no existe" };
      } else {
        data.splice(index, 1);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }
};
