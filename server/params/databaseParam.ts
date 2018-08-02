import AuthenticationParam from './authenticationParam';

export default class DatabaseParam {

  address: string;
  port: string;
  authentication: AuthenticationParam;
  userId: string;
  databaseName: string;
  collectionName: string;

  constructor(data) {
    Object.assign(this, data);
    this.address = this.address.replace(/(^\w+:|^)\/\//, '');
  }

  public getURI() {
    let uri;
    if (this.hasAuthentication()) {
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
    return `${this.authentication.userName}:${this.authentication.password}@${address}
      ?authSource=${this.authentication.authDatabase}
      &authMechanism=${this.authentication.authMechanism}`;
  }

  private hasAuthentication() {
    return this.authentication && this.authentication.isValid();
  }

}
