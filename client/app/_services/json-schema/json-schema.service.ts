import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthorizationParam, DatabaseParam } from '../../_params/params';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class JsonSchemaService {

 	constructor(private http: Http, private loadingService: LoadingService) { }

	discovery(databaseParam: DatabaseParam) {
    this.loadingService.show();
		return this.http.post('/api/batch/rawschema/steps/all', databaseParam, this.jwt())
			.map((response: Response) => response.json());
	}

  listBatches(){
    this.loadingService.show();
		return this.http.get('/api/batches', this.jwt())
			.map((response: Response) => response.json())
      .finally(() => this.loadingService.hide());
	}

  deleteBatch(batchId){
    this.loadingService.show();
    return this.http.delete(`/api/batch/${batchId}`, this.jwt())
      .map((response: Response) => "OK")
      .finally(() => this.loadingService.hide());
  }

  getBatchById(batchId){
    this.loadingService.show();
    return this.http.get(`/api/batch/${batchId}`, this.jwt())
      .map((response: Response) => response.json())
      .finally(() => this.loadingService.hide());
  }

  getJsonSchemaByBatchId(batchId){
    this.loadingService.show();
    return this.http.get(`/api/batch/jsonschema/generate/${batchId}`, this.jwt())
      .map((response: Response) => response.json())
      .finally(() => this.loadingService.hide());
  }

  private jwt() {
    return new AuthorizationParam();
  }

}
