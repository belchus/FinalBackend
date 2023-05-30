const logger = require("../utils/logger.js");

module.exports = class Container {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    try {
      const data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getById(id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "el producto no existe" };
      } else {
        return data[0];
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getByMongo(id){
    try {
      const data = await this.model.findById(`${id}`)
      if(data.error) {
        return { error: "el producto no existe" };
      } else {
        return data
      }
    } catch (error) {
      logger.error(error)
      return {error: error}
    }
  }

  async getByCategory(category) {
    try {
      const data = await this.model.find({ code: category });
      if (data.length == 0) {
        return { error: "el producto no existe" };
      } else {
        return data;
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }
/*
  async getCategories() {
    try {
      const inventory = await this.getProducts();
      const categories = Object.keys(
        inventory.reduce((acc, obj) => {
          acc[obj.code] = true;
          return acc;
        }, {})
      );
      return categories;
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }
*/
  async saveProduct(object) {
    try {
      const data = await this.model.find({});
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
        return { error: "este campo es obligatorio"};
      } else if (!object.description) {
        return { error: "este campo es obligatorio"};
      } else if (idMaximo == -Infinity) {
        object.id = 1;
        object.timestamp = Date.now();
        await this.model.create(object);
        return null;
      } else {
        const idMaximo = Math.max(...ids);
        object.id = idMaximo + 1;
        object.timestamp = Date.now();
        await this.model.create(object);
        return object;
      }
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }

  async updateProduct(object, id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "producto no encontrado" };
      } else if (!object.title) {
        return { error: "este campo es obligatorio" };
      } else if (!object.price) {
        return { error: "este campo es obligatorio" };
      } else if (!object.code) {
        return { error: "este campo es obligatorio" };
      } else if (!object.thumbnail) {
        return { error: "este campo es obligatorio" };
      } else if (!object.stock) {
        return { error: "este campo es obligatorio"};
      } else if (!object.description) {
        return { error: "este campo es obligatorio" };
      } else {
        object.id = id;
        object.timestamp = data.timestamp;
        await this.model.updateOne(
          { id: id },
          {
            $set: {
              title: object.title,
              price: object.price,
              code: object.code,
              thumbnail: object.thumbnail,
              stock: object.stock,
              description: object.description,
            },
          }
        );
      }
    } catch (error) {
      logger.error("ERROR", error);
      return { error: error };
    }
  }

  async deleteById(id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "el producto no existe" };
      } else {
        await this.model.deleteOne({ id: id });
      }
    } catch (error) {
      logger.error("ERROR ", error);
      return { error: error };
    }
  }

  
  productDetail(source, qty) {
    const product = {
      id: source.id,
      timestamp: source.timestamp,
      title: source.title,
      description: source.description,
      code: source.code,
      thumbnail: source.thumbnail,
      price: source.price,
      stock: qty,
    };
    return product;
  }
};
