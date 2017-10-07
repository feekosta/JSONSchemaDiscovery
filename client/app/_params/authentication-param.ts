export class AuthenticationParam {
	authDatabase:string;
	userName:string;
	password:string;
	authMechanism:string;
	constructor(){
		this.authMechanism = "MONGODB-CR"
	}
}