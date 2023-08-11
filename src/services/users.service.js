import { modelUsuario } from '../DAO/models/db/users.model.db.js';
//import { modelUsuario } from '../DAO/models/mem/users.model.mem.js';
class UserService {
  validatePostUser(firstName, lastName, email) {
    if (!firstName || !lastName || !email) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validatePutUser(id, firstName, lastName, email) {
    if ((!id, !firstName || !lastName || !email)) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }

  validateId(id) {
    if (!id) {
      console.log('validation error: please complete firstName, lastname and email.');
      throw 'VALDIATION ERROR';
    }
  }
  async getAllUsers() {
    const users = await modelUsuario.getAllUsers();
    return users;
  }

  async getOneUser(id) {
    const user = await modelUsuario.getOneUser(id);
    return user;
  }

  async createUser(firstName, lastName, email) {
    this.validatePostUser(firstName, lastName, email);
    const userCreated = await modelUsuario.createUser(firstName, lastName, email);
    return userCreated;
  }

  async updateUser(id, firstName, lastName, email) {
    this.validatePostUser(id, firstName, lastName, email);
    const userUptaded = await modelUsuario.updateUser(id, firstName, lastName, email);
    return userUptaded;
  }

  async deleteUser(id) {
    this.validateId(id);
    const deleted = await modelUsuario.deleteUser(id);
    return deleted;
  }
}

export const userService = new UserService();
