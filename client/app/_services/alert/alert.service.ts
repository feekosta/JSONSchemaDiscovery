import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class AlertService {

	private _baseUrl: string = "/api/";
	private _allAlertsUrl: string = this._baseUrl + "alerts";
	private _allAlertsCountUrl: string = this._baseUrl + "alerts/count";

	constructor(private http: Http) { }

	listAlerts(){
		return this.http.get(this._allAlertsUrl, this.jwt())
			.map((response: Response) => response.json());
	}

	countAlerts(){
		return this.http.get(this._allAlertsCountUrl, this.jwt())
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
