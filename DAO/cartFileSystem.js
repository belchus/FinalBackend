const fs = require("fs");
const main = require("../main");
const logger = require("../utils/logger.js");
const { add } = require("winston");

module.exports = class Cart {
  constructor(file) {
    this.file = file;
  }
  async getCarts() {
    await main.fileCheck(this.file);
    try {
      const allCarts = await this.fileCatcher(this.file);
      return allCarts;
    } catch (error) {
      logger.error("error", error);
      return { error: error };
    }
  }

  async getById(id) {
    await main.fileCheck(this.file);
    if ((await this.cartFinder(id)) == -1) {
      return { error: "el carrito con el id no existe" };
    } else {
      try {
        const product = await this.cartDetail(id);
        return product;
      } catch (error) {
        logger.error(error);
        return { error: error };
      }
    }
  }

  async saveCart(data) {
    await main.fileCheck(this.file);
    try {
      if ((await this.cartFinder(data.id)) == -1) {
        data.product = []
        this.newCart(data);
        return { id: main.userOnline };
      } else {
        return {
          error: "ya hay un carrito existente",
        };
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async addToCart(data) {
     console.log(addProduct,"asd");
    await main.fileCheck(this.file);
    const carts = await this.fileCatcher(this.file);
    const cart = carts[await this.cartFinder(main.userOnline)];
    const product = await this.productFinder(data.id, "./db/product.txt");
    const addProduct = this.productDetail(product, data.qty);

    if (main.userOnline == 0) {
      return {
        error: "debe estar logeado.",
      };
    } else if (product == false) {
      return {
        error:
          "el producto no existe",
      };
    } else if (data.qty == undefined) {
      return {
        error: "selecciona cuantos items quieres agregar",
      };
    } else if ((await this.cartFinder(main.userOnline)) == -1) {
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
      const userProducts = await this.cartViewer(main.userOnline);
      const index = await userProducts.findIndex(
        (product) => product.id == data.id
      );
      const userCart = {
        id: cart.id,
        email: data.email,
        timestamp: cart.timestamp,
        product: userProducts,
      };
      if (index == -1) {
        userProducts.push(addProduct);
        carts.splice(await this.cartFinder(main.userOnline), 1, userCart);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(carts, null, 2)
        );
        return null;
      } else {
        userProducts.splice(index, 1, addProduct);
        carts.splice(await this.cartFinder(main.userOnline), 1, userCart);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(carts, null, 2)
        );
        return null;
      }
    }
  }

  async deleteCart(id) {
    await main.fileCheck(this.file);
    if ((await this.cartFinder(id)) == -1) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        await this.cartSplicer(id);
      } catch (error) {
        logger.error(error);
        return { error: error };
      }
    }
  }

  async deleteProduct(idUser, idProd) {
    await main.fileCheck(this.file);
    if ((await this.cartFinder(idUser)) == -1) {
      return { error: "carrito no encontrado" };
    } else if ((await this.cartProductIndexer(idUser, idProd)) == -1) {
      return { error: "producto no encontrado" };
    } else {
      const carts = await this.fileCatcher(this.file);
      const cart = carts[await this.cartFinder(idUser)];
      const products = await this.cartViewer(idUser);
      const index = await this.cartProductIndexer(idUser, idProd);
      products.splice(index, 1);
      const userCart = {
        id: cart.id,
        timestamp: cart.timestamp,
        product: products,
      };
      carts.splice(await this.cartFinder(idUser), 1, userCart);
      await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
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
    const file = await this.fileCatcher(this.file);
    const cart = { 
      id: cartData.id, 
      timestamp: Date.now(),
      email: cartData.email, 
      product: cartData.product,
    };
    file.push(cart);
    await fs.promises.writeFile(this.file, JSON.stringify(file, null, 2));
  }

  async cartFinder(id) {
    const file = await this.fileCatcher(this.file);
    const index = file.findIndex((cart) => cart.id == id);
    return index;
  }

  async cartProductIndexer(idUser, idProduct) {
    const products = await this.cartViewer(idUser);
    const index = products.findIndex((product) => product.id == idProduct);
    return index;
  }

  async cartDetail(id) {
    const file = await this.fileCatcher(this.file);
    return file[await this.cartFinder(id)].product;
  }

  async productFinder(id, source) {
    try {
      const file = await this.fileCatcher(source);
      const index = file.findIndex((product) => product.id == id);
      return file[index] || false;
    } catch (error) {
      logger.error(error);
    }
  }

  async cartSplicer(id) {
    const file = await this.fileCatcher(this.file);
    file.splice(await this.cartFinder(id), 1);
    await fs.promises.writeFile(this.file, JSON.stringify(file, null, 2));
  }

  async fileCatcher(source) {
    const file = await fs.promises.readFile(source, "utf-8");
    const data = JSON.parse(file);
    return data;
  }
};
