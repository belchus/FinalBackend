module.exports = class UsersDTO {
  constructor(data) {
    this.data = data;
  }
  allUsers() {
    if (this.data.error) {
      return this.data;
    } else {
      const users = [];
      this.data.forEach((user) => {
        const thisuser = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          avatar: user.avatar,
          admin: user.admin,
          password: user.password,
        };
        users.push(thisuser);
      });
      return users;
    }
  }

  user() {
    if (this.data.error) {
      return this.data;
    } else {
      const user = {
        id: this.data.id,
        firstname: this.data.firstname,
        lastname: this.data.lastname,
        email: this.data.email,
        avatar: this.data.avatar,
        admin: this.data.admin,
        password: this.data.password,
      };
      return user;
    }
  }
};
