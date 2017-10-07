import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class AuthenticationService {

	private baseUrl: string = "/api/";
	private loginUrl: string = this.baseUrl+"login";

	constructor(private http: Http, private loadingService: LoadingService) { }

	login(email: string, password: string) {
		this.loadingService.show();
		return this.http.post(this.loginUrl, { 'email': email, 'password': password })
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				const user = response.json();
				if (user && user.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('currentUser', JSON.stringify(user));
				}
			}).finally(() => this.loadingService.hide());
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
	}

}
