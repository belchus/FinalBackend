const userMongo = require("../DAO/userMongo.js");
const model = require("../models/userModel.js");
const { run } = require("../server.js");
const DTO = require("../DTOS/userDTO.js");

function factoryRepository(type) {
  this.createRepository = function () {
    if (type === "dev") {
      return new Repository(model);
    } else if (type === "prod") {
      return new Repository(model);
    }
  };
  class Repository extends userMongo {
    constructor(source) {
      super(source);
    }
    async listAll() {
      const data = await this.getAll();
      const dtoResponse = new DTO(data);
      return dtoResponse.allUsers();
    }
    async listById(id) {
      const data = await this.getById(id);
      const dtoResponse = new DTO(data);
      return dtoResponse.user();
    }

    async listByMail(email) {
      const data = await this.getByMail(email)
      const dtoResponse = new DTO(data)
      return dtoResponse.user()
    }

    async setUserOnline(object) {
      const data = await this.userOnline(object);
      return data;
    }
    async save(user) {
      const data = await this.saveUser(user);
      return data;
    }
    async update(user, id) {
      const data = await this.updateUser(user, id);
      return data;
    }
    async delete(id) {
      const data = await this.deleteById(id);
      return data;
    }
  }
}

var userFactory = new factoryRepository(run).createRepository();

module.exports = { userFactory };
