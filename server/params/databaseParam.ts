import AuthenticationParam from './authenticationParam';

class DatabaseParam {

	address:String;
	port:String;
	authentication:AuthenticationParam;
	userId:String;

	databaseName:String;
	collectionName:String;

	constructor(data) {
		Object.assign(this, data);
	}

	public getURI() {
		let uri;
		if(this.authentication){
			uri = this.getURIWithAuthentication(`${this.address}:${this.port}/${this.databaseName}`);
		} else {
			uri = this.getURIWithoutAuthentication();
		}
		return `mongodb://${uri}`;
	}

	public getURIWithoutAuthentication() {
		return `${this.address}:${this.port}/${this.databaseName}`;
	}

	public getURIWithAuthentication(address) {
		return `${this.authentication.userName}:${this.authentication.password}@${address}?authSource=${this.authentication.authDatabase}&authMechanism=${this.authentication.authMechanism}`;
	}

}

export default DatabaseParam;
