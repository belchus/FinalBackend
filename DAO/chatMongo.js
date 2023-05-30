const logger = require("../utils/logger.js");

module.exports = class ChatMongo {
  constructor(model) {
    this.model = model;
  }
  async getChats() {
    try {
      const data = await this.model.find({});
      return data;
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }
  async getByEmail(email) {
    try {
      const data = await this.model.find(
        { email: email },
        { msg: 1, _id: 0 }
      );
      if (data.length == 0) {
        return { error: "el usuario no existe" };
      } else {
        const result = data[0].msg;
        const resultReverse = result.reverse()
        return resultReverse;
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }
  async addChannel(data) {
    try {
      if ((await this.channelFinder(data.to)) == 0) {
        const channel = {
          rol: data.rol, 
          email: data.email, 
          firstname: data.firstname, 
          msg: [] };
        await this.model.create(channel);
        return { email: data.email };
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async newMessage(msg) {
    try {
        if((await this.channelFinder(msg.email)) == 0) {
            await this.newchannel(msg)
        } else {
            const newMsg = this.msgDetail(msg)
           await this.model.updateOne(
            {email: `${msg.to}`}, 
            {$addToSet: {msg: newMsg}})
        }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  msgDetail(msg) {
    const date = new Date().toLocaleString();
    const thismsg = {
      email: msg.email,
      rol:msg.rol,
     date: date,
      msg: msg.thismsg,
    };
    return thismsg;
  }

async newchannel(data) {
    try {
      const channel = {tipo: data.tipo, email: data.email, nombre: data.nombre, mensajes: [this.messageBuilder(data)] };
      await this.model.create(channel);
    } catch (error){
      logger.error(error)
      return {error: error}
    }
  }

  async channelFinder(email) {
    const data = await this.model.find({ email: email });
    return data.length;
  }
};
