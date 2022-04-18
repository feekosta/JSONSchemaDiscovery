import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import {finalize} from 'rxjs/operators';
import {Alert} from './alert';

@Injectable()
export class AlertService {

  private baseUrl = '/api/';
  private allAlertsUrl: string = this.baseUrl + 'alerts';
  private allAlertsCountUrl: string = this.allAlertsUrl + '/count';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  listAlerts() {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<Alert[]>(this.allAlertsUrl, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  countAlerts() {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<number>(this.allAlertsCountUrl, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  deleteAlert(alertId) {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.delete(`/api/alert/${alertId}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

}
