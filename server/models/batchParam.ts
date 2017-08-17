class BatchParam {

	dbUrl;
	dbPort;
	dbName;
	dbLogin;
	dbPasswd;
	dbAuthMechanism;
	dbCollection;
	userId;

	constructor(data) {
		Object.assign(this, data);
	}

	public getURI() {
		let uri;
		if(this.dbLogin && this.dbPasswd){
			uri = "mongodb://"+this.dbLogin+":"+this.dbPasswd+"@"+this.dbUrl+":"+this.dbPort+"/"+this.dbCollection+"?authSource=admin";
		} else {
			uri = "mongodb://"+this.dbUrl+":"+this.dbPort+"/"+this.dbCollection
		}
		if(this.dbAuthMechanism)
			uri = uri+ (uri.indexOf("?") >= 0 ? "&" : "&")+"authMechanism="+this.dbAuthMechanism;
		return uri;
	}

}

export default BatchParam
