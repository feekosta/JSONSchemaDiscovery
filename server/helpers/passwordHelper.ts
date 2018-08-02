import * as bcrypt from 'bcryptjs';

export default abstract class PasswordHelper {

  static crypt(password): Promise<any> {
    return new Promise((resolv, reject) => {
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => resolv(hash))
        .catch(error => reject(error));
    });
  }

}
