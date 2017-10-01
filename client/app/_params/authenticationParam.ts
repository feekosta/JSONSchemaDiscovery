class AuthenticationParam {
	authDatabase:String;
	userName:String;
	password:String;
	authMechanism:String;
	constructor(){
		this.authMechanism = "MONGODB-CR"
	}
}
export default AuthenticationParam;
