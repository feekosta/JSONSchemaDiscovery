export default class AuthenticationParam {

  authDatabase: String;
  userName: String;
  password: String;
  authMechanism: String;

  public isValid = (): boolean => {
    return this.authDatabase != null && this.userName != null && this.password != null && this.authMechanism != null;
  };

}
