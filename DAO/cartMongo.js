const main = require("../main");
const productModel = require("../models/productModel.js"); 
const logger = require("../utils/logger.js");

module.exports = class Container {
  constructor(model) {
    this.model = model;
  }
  async getCarts() {
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
      const data = await this.model.find({ id: id }, { product: 1, _id: 0 });
      if (data.length == 0) {
        return { error: "el carrito con el id no existe" };
      } else {
        return data[0].product;
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async saveCart(data) {
    try {
      if ((await this.cartFinder(data.id)) == 0) {
        data.product = []
        this.newCart(data);
        return { id: main.userOnline };
      } else {
        return { error: "ya hay un carrito existente" };
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async deleteCart(id) {
    const idParsed = parseInt(id);
    if ((await this.cartFinder(main.userOnline).length) == 0) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        await this.model.deleteOne({ id: idParsed });
      } catch (error) {
        logger.error(error);
        return { error: error };
      }
    }
  }
  async addToCart(data) {
    const product = await productModel.find({ id: data.id });
    if (main.userOnline == 0) {
      return {
        error: "debe estar logueado.",
      };
    } else if (product.length == 0) {
      return {
        error:
          "el producto no existe",
      };
    } else if (data.cantidad == undefined) {
      return {
        error: "selecciona cuantos items quieres agregar",
      };
    } else if ((await this.cartFinder(main.userOnline)) == 0) {
      const addProduct = this.productDetail(product[0], data.cantidad);
      const cartDetail = {
        id: main.userOnline,
        email: data.email,
        product: [addProduct]
      }
      await this.newCart(cartDetail);
      return {
        error:
          "se creo un carrito con el item",
      };
    } else {
      try {
        const addProduct = this.productDetail(product[0], data.qty);
        if ((await this.productExistence(data.id)) == 0) {
          await this.model.updateOne(
            { id: main.userOnline },
            { $addToSet: { product: addProduct } }
          );
        } else {
          const query = { id: main.userOnline, "product.id": parseInt(data.id) };
          const updateDocument = {
            $set: { "product.$.stock": parseInt(data.qty) },
          };
          await this.model.updateOne(query, updateDocument);
        }
      } catch (error) {
        return { error: error };
      }
    }
  }

  async deleteFromCart(idUser, idProd) {
    const idUsrParsed = parseInt(idUser);
    const idPrdParsed = parseInt(idProd);
    if ((await this.cartFinder(idUser)) == 0) {
      return { error: "carrito no encontrado" };
    } else if ((await this.productExistence(idPrdParsed)) == 0) {
      return { error: "producto no encontrado" };
    } else {
      await this.model.updateOne(
        { id: idUsrParsed },
        { $pull: { product: { id: idPrdParsed } } }
      );
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


  async newCart(cartData) {
    const cart = { 
      id: cartData.id, 
      timestamp: Date.now(), 
      email: cartData.email, 
      product: cartData.product 
    };
    await this.model.create(cart);
  }

  async cartFinder(id) {
    const data = await this.model.find({ id: id });
    return data.length;
  }

  async productExistence(id) {
    const idParsed = parseInt(id);
    const result = await this.model.find({
      $and: [{ id: main.userOnline }, { "product.id": idParsed }],
    });
    return result.length;
  }
};
