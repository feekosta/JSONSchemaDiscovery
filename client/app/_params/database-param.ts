import { AuthenticationParam } from './authentication-param';

export class DatabaseParam {

  address: string;
  port: string;
  authentication: AuthenticationParam;
  userId: string;
  databaseName: string;
  collectionName: string;
  rawSchemaFormat: boolean;

  constructor() {
    this.authentication = new AuthenticationParam();
  }
}
