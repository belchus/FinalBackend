const chatMongo = require("../DAO/chatMongo");
const chatModel = require("../models/chatModel");

module.exports = class ChatRepository extends chatMongo {
  constructor() {
    super(chatModel);
  }
  async getAllChannels() {
    const data = await this.getChats();
    return data;
  }
  async getChannelByMail(email) {
    const data = await this.getByEmail(email);
    return data;
  }
  async sendMessage(msg) {
    const data = await this.newMessage(msg);
    return data;
  }
};
