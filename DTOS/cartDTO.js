module.exports = class CartDTO {
  constructor(data) {
    this.data = data;
  }
  allCarts() {
    if (this.data.error) {
      return this.data;
    } else {
      const carts = [];
      this.data.forEach((cart) => {
        const thiscart = {
          id: cart.id,
          products: cart.products.map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            code: product.code,
            thumbnail: product.thumbnail,
            price: product.price,
            stock: product.stock,
          })),
        };
        carts.push(thiscart);
      });
      return carts;
    }
  }

  Cart() {
    if (this.data.error) {
      return this.data;
    } else {
      const carts = [];
      this.data.forEach((product) => {
        const cart = {
          id: product.id,
          title: product.title,
          description: product.description,
          code: product.code,
          thumbnail: product.thumbnail,
          price: product.price,
          stock: product.stock,
        };
        carts.push(cart);
      });
      return this.data;
    }
  }
};
