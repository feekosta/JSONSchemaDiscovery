import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoadingService } from '../loading/loading.service';
import { AuthorizationParam } from '../../_params/params';

@Injectable()
export class AlertService {

	private baseUrl: string = "/api/";
	private allAlertsUrl: string = this.baseUrl+"alerts";
	private allAlertsCountUrl: string = this.allAlertsUrl+"/count";

	constructor(private http: Http, private loadingService: LoadingService) { }

	listAlerts(){
		this.loadingService.show();
		return this.http.get(this.allAlertsUrl, this.jwt())
			.map((response: Response) => response.json())
			.finally(() => {this.loadingService.hide()});
	}

	countAlerts(){
		this.loadingService.show();
		return this.http.get(this.allAlertsCountUrl, this.jwt())
			.map((response: Response) => response.json())
			.finally(() => {this.loadingService.hide()});
	}

	deleteAlert(alertId){
		this.loadingService.show();
		return this.http.delete(`/api/alert/${alertId}`, this.jwt())
		  .map((response: Response) => "OK")
		  .finally(() => this.loadingService.hide());
	}

	private jwt() {
		return new AuthorizationParam();
	}

}
