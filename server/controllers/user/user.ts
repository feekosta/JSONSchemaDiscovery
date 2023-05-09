import * as jwt from 'jsonwebtoken';
import User from '../../models/user/user';
import PasswordHelper from '../../helpers/passwordHelper';
import BaseController from '../base';

export default class UserController extends BaseController {

  model = User;

  login = (email: String, password: String): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOne({'email': email})
        .then(user => {
          if (!user) return reject({'message': 'Não foi possível encontrar sua conta.', 'code': 404});
          // @ts-ignore
          return user.comparePassword(password)
            .then(isMatch => {
              if (!isMatch) return reject({'message': 'Senha incorreta. Tente novamente.', 'code': 403});
              return resolv({'token': jwt.sign({'user': user}, process.env.SECRET_TOKEN)});
            });
        });
    });
  };

  getUser = (userId: String): Promise<any> => {
    return new Promise((resolv, reject) => {
      this.model.findOne({'_id': userId})
        .then(user => {
          if (user) return resolv(user);
          return reject({'message': 'Não foi possível encontrar sua conta.', 'code': 404});
        });
    });
  };

  register = (req, res) => {
    PasswordHelper.crypt(req.body.password)
      .then(password => {
        req.body.password = password;
        return this.insert(req, res);
      }).catch(error => this.error(res, error, 500));
  };
}
