import express from 'express';
import { userService } from '../services/users.service.js';
export const routerUsers = express.Router();

routerUsers.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({
      status: 'success',
      msg: 'listado de usuarios',
      data: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerUsers.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userCreated = await userService.createUser(firstName, lastName, email);

    return res.status(201).json({
      status: 'success',
      msg: 'user created',
      data: userCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerUsers.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const userUptaded = await userService.updateUser(id, firstName, lastName, email);
    return res.status(201).json({
      status: 'success',
      msg: 'user uptaded',
      data: userUptaded,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});

routerUsers.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    return res.status(200).json({
      status: 'success',
      msg: 'user deleted',
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'something went wrong :(',
      data: {},
    });
  }
});
