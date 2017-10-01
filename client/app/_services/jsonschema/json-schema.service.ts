import { Injectable } from '@angular/core';

@Injectable()
export class JsonSchemaService {

  constructor() { }

  listJsonSchemes(){
		return [{
			"batchId":"21213",
			"userId":"123322",
			"databaseUrl":"mongodb://192.168.0.1/testbd",
			"collection":"contatos",
			"schema": "{\"id\":\"string\"}"
		},{
			"batchId":"111111",
			"userId":"333333333",
			"databaseUrl":"mongodb://10.0.0.1/test",
			"collection":"usuarios",
			"schema": "{\"id\":\"string\"}"
		},{
			"batchId":"111111",
			"userId":"333333333",
			"databaseUrl":"mongodb://10.0.0.1/test",
			"collection":"usuarios",
			"schema": "{\"id\":\"string\"}"
		}]
	}

}
