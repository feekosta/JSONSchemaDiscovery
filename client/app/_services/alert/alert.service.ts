import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class AlertService {

	constructor(private http: Http) { }

	listAlerts(){
		return this.http.get('/api/alerts', this.jwt())
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
