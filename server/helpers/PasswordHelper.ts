import * as bcrypt from 'bcryptjs';
class PasswordHelper {
	static crypt(password, callback) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) { return callback(err); }
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) { return callback(error); }
				callback(hash);
			});
	    });
	}
}
export default PasswordHelper;