import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../../_models/user';

@Injectable()
export class RegistrationService {

	constructor(private http: Http) { }

	register(user: User) {
		return this.http.post('/api/register', user, this.jwt())
			.map((response: Response) => response.json());
	}

	// private helper methods
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

}
