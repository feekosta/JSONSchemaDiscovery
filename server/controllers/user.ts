import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseController from './base';
import PasswordHelper from '../helpers/PasswordHelper';

export default class UserController extends BaseController {
  
  model = User;

  login = (req, res) => {
    this.model.findOne({ 'email': req.body.email }, (err, user) => {
      if (!user) { return this.error(res, "Usuário não encontrado.", 403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return this.error(res, "Senha incorreta.", 403); }
        const token = jwt.sign({ 'user': user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        this.success(res, { 'token': token });
      });
    });
  }

  register = (req, res) => {
    PasswordHelper.crypt(req.body.password, (password) => {
      if(password.error) { return this.error(res, password.error, 500); }
      req.body.password = password;
      return this.insert(req, res);
    });
  }
}
