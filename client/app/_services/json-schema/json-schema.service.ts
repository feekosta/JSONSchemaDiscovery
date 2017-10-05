import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import DatabaseParam from '../../_params/databaseParam';

@Injectable()
export class JsonSchemaService {

 	constructor(private http: Http) { }

	discovery(databaseParam: DatabaseParam) {
		return this.http.post('/api/batch/rawschema/steps/all', databaseParam, this.jwt())
			.map((response: Response) => response.json());
	}

  listBatches(){
		return this.http.get('/api/batches', this.jwt())
			.map((response: Response) => response.json());
	}

  deleteBatch(batchId){
    return this.http.delete(`/api/batch/${batchId}`, this.jwt())
      .map((response: Response) => "OK");
  }

  getBatchById(batchId){
    return this.http.get(`/api/batch/${batchId}`, this.jwt())
      .map((response: Response) => response.json());
  }

  getJsonSchemaByBatchId(batchId){
    return this.http.get(`/api/batch/jsonschema/generate/${batchId}`, this.jwt())
      .map((response: Response) => response.json());
  }

  private jwt() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
          const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
          return new RequestOptions({ headers: headers });
      }
  }

}
