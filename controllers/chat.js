const chatRepo = require("../repository/ChatRepository.js");
const chat = new chatRepo();

async function allchannels() {

  const result = await chat. getAllChannels();
return result;
}

async function thischannel(email) {
  const result = await chat.getChannelByMail(email);
  return result;
}

async function sendMessage(msg) {
  const result = await chat.sendMessage(msg);
  return result;
}

module.exports = { allchannels, thischannel, sendMessage };
