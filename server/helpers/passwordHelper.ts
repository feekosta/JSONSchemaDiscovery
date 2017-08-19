import * as bcrypt from 'bcryptjs';
abstract class PasswordHelper {
	static crypt(password, callback) {
		bcrypt.genSalt(10, (saltError, salt) => {
			if (saltError) { return callback(saltError); }
			bcrypt.hash(password, salt, (hashError, hash) => {
				if (hashError) { return callback(hashError); }
				callback(hash);
			});
	    });
	}
}
export default PasswordHelper;