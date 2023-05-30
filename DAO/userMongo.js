require("dotenv").config();
const bcript = require("bcryptjs");
const { enviarMail } = require("../utils/nodemailer.js");
const logger = require("../utils/logger.js");
const main = require("../main.js");
const chatHandler = require('./chatMongo.js')
const chatModel = require('../models/chatModel.js')
const chat = new chatHandler(chatModel)

module.exports = class userHandler {
  constructor(model) {
    this.model = model;
  }

  userOnline(object) {
    main.userOnline = object.id;
    return { exito: ` ${object.id} online` };
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
        return { error: "usuario no encontrado" };
      } else {
        return data[0];
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async getByMail(email) {
    try {
      const data = await this.model.find({ email: email });
      if (data.length == 0) {
        return { error: "usuario no encontrado" };
      } else {
        return data[0];
      }
    } catch (error) {
      logger.error(error);
      return { error: error };
    }
  }

  async saveUser(data) {
    const user = await this.model.findOne({ email: data.email });
    if (user) {
      return { error: "ya hay alguien registrado con esas credenciales." };
    } else if (!data.firstname) {
      return { error: "este campo es obligatorio" };
    } else if (!data.lastname) {
      return { error: "este campo es obligatorio" };
    } else if (!data.address) {
      return { error: "este campo es obligatorio" };
    } else if (!data.email) {
      return { error: "este campo es obligatorio" };
    } else if (!data.avatar) {
      return { error: "este campo es obligatorio" };
    } else if (!data.admin) {
      return { error: "este campo es obligatorio" };
    } else if (!data.password) {
      return { error: "este campo es obligatorio" };
    } else {
      try {
        const encript = await bcript.hash(data.password, 10);
        const newUser = {
          id: await this.getHighestId(),
          firstname: data.firstname,
          lastname: data.lastname,
          address:data.address,
          email: data.email,
          avatar: data.avatar,
          admin: data.admin,
          password: encript,
        };
        await this.model.create(newUser);
        logger.info("Se creo un nuevo usuario");
        const newChat ={
          rol: this.setUserType(data.admin),
          email: data.email,
          firstname: `${data.firstname} ${data.lastname}`,
        }
        await chat.addChannel(newChat)
        this.notify(newUser);
      } catch (error) {
        logger.error(error);
        return { error: error };
      }
    }
  }

  async updateUser(user, id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "usuario no encontrado" };
      } else if (!user.firstname) {
        return { error: "este campo es obligatorio" };
      } else if (!user.lastname) {
        return { error: "este campo es obligatorio" };
      } else if (!user.email) {
        return { error: "este campo es obligatorio" };
      } else if (!user.avatar) {
        return { error: "este campo es obligatorio" };
      } else if (!user.admin) {
        return { error: "este campo es obligatorio" };
      } else {
        user.id = id;
        user.timestamp = data.timestamp;
        await this.model.updateOne(
          { id: id },
          {
            $set: {
              firstname: user.firstname,
              lastname: user.lastname,
              address: user.address,
              email: user.email,
              avatar: user.avatar,
              admin: user.admin,
            },
          }
        );
      }
    } catch (error) {
      logger.error("error!: ", error);
      return {error: error}
    }
  }

  async deleteById(id) {
    try {
      const data = await this.model.find({ id: id });
      if (data.length == 0) {
        return { error: "el " };
      } else {
        await this.model.deleteOne({ id: id });
      }
    } catch (error) {
      logger.error("ERROR", error);
      return {error: error}
    }
  }

  async getHighestId() {
    const data = await this.model.find({}, { id: 1, _id: 0 });
    if (data.length == 0) {
      return 1;
    } else {
      const highest = Math.max(...data.map((o) => o.id));
      const result = highest + 1;
      return result;
    }
  }

  setUserType(user){
    if(user.admin === "true"){
      return "sistema"
    } else {
      return "usuario"
    }
  }

  async notify(newUser) {
    const msg = {
      asunto: "Registro",
      mensaje: `${newUser.firstname} se ha registrado.
        nombre y apellido: ${newUser.firstname} ${newUser.lastname},
        dirección: ${newUser.address},
         email: ${newUser.email}.`,
    };
    enviarMail(msg.asunto, msg.mensaje, process.env.EMAIL_DESTINATION);
  }
};
