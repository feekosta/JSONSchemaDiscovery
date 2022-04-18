import { Injectable } from '@angular/core';
import { DatabaseParam } from '../../_params/params';
import { LoadingService } from '../loading/loading.service';
import {finalize, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {JsonSchemaExtracted, RawSchemaBatch} from './json-schema';
import {Alert} from '../alert/alert';

@Injectable()
export class JsonSchemaService {

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  discovery(databaseParam: DatabaseParam) {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.post<Alert>('/api/batch/rawschema/steps/all', databaseParam, {headers})
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  listBatches() {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<RawSchemaBatch[]>('/api/batches', { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  deleteBatch(batchId) {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.delete(`/api/batch/${batchId}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  getBatchById(batchId) {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<RawSchemaBatch>(`/api/batch/${batchId}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  getJsonSchemaByBatchId(batchId) {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<JsonSchemaExtracted[]>(`/api/batch/jsonschema/generate/${batchId}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

}
