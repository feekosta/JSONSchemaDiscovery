import AuthenticationParam from './authenticationParam';
class DatabaseParam {
	address:String;
	port:String;
	authentication:AuthenticationParam;
	userId:String;
	databaseName:String;
	collectionName:String;
	constructor() {
		this.authentication = new AuthenticationParam();
	}
}
export default DatabaseParam;
