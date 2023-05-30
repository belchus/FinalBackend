const logger = require("../utils/logger.js");

module.exports = class Container {
  constructor(model) {
    this.model = model;
  }
  async getOrders() {
    try {
      const data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getByMail(email) {
    try {
      const data = await this.model.find({ email: email });
      return data[0];
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async addOrder(data) {
    const order = {
      email: data.email,
      id: 1,
      date: new Date().toLocaleString(),
     status: "SEND",
      order: data.order,
    };
    const finder = await this.accountFinder(data.email);
    try {
      if (finder == 0) {
        this.newOrder(order);
      } else {
        order.id = await this.getNextId(data.email);
        await this.model.updateOne(
          { email: `${data.email}` },
          { $addToSet: { order: order } }
        );
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }



  async newOrder(order) {
    const newOrder = {
       email: order.email, 
       orders: [order] 
      };
    await this.model.create(newOrder);
  }

  async getNextId(email) {
    const data = await this.getByMail(email);
    const ids = data.orders.map((product) => product.id);
    const idMaximo = Math.max(...ids);
    return idMaximo + 1;
  }

  async accountFinder(email) {
    const data = await this.model.find({ email: email });
    return data.length;
  }
};
