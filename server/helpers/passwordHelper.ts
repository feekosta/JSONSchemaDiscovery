import * as bcrypt from 'bcryptjs';
abstract class PasswordHelper {
	static crypt(password): Promise<any>{
		return new Promise((resolv, reject) => {
			bcrypt.genSalt(10).then((salt) => {
				bcrypt.hash(password, salt).then((hash) => {
					resolv(hash);
				}, (error) => {
					reject(error); 
				});
	    	}, (error) => {
	    		reject(error); 
	    	});
		});
	}
}
export default PasswordHelper;