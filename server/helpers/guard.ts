import * as jwt from 'jsonwebtoken';

export default class Guard {

  public static checkToken = (req): Promise<any> => {
    return new Promise((resolv, reject) => {
      const authorization = req.headers.authorization;
      if (!authorization) return reject({'message': 'invalid token', 'code': 403});
      const bearer = authorization.split('Bearer ');
      if (bearer.length !== 2) return reject({'message': 'invalid token', 'code': 403});
      const token = bearer[1];
      return resolv(jwt.verify(token, process.env.SECRET_TOKEN).user);
    });
  }

}
