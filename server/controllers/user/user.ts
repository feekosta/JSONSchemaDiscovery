import * as jwt from 'jsonwebtoken';
import User from '../../models/user/user';
import PasswordHelper from '../../helpers/passwordHelper';
import BaseController from '../base';

export default class UserController extends BaseController {
  
  model = User;

  login = (req, res) => {
    this.model.findOne({ 'email': req.body.email }).then((user) => {
      if(!user){ return this.error(res, "Não foi possível encontrar sua conta.", 404); }
      return user.comparePassword(req.body.password).then((isMatch) => {
        if(!isMatch)
          return this.error(res, "Senha incorreta. Tente novamente.", 403);
        return this.success(res, { 'token': jwt.sign({ 'user': user }, process.env.SECRET_TOKEN) });
      });
    })
  }

  register = (req, res) => {
    PasswordHelper.crypt(req.body.password).then((password) => {
      req.body.password = password;
      return this.insert(req, res);
    }, (error) => {
      return this.error(res, error, 500);
    });
  }
}
