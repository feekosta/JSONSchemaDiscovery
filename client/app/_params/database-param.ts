import { AuthenticationParam } from './authentication-param';
export class DatabaseParam {
	address:string;
	port:string;
	authentication:AuthenticationParam;
	userId:string;
	databaseName:string;
	collectionName:string;
	constructor() {
		this.authentication = new AuthenticationParam();
	}
}