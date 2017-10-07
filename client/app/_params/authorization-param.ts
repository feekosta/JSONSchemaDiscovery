import { Headers, RequestOptions } from '@angular/http';
export class AuthorizationParam extends RequestOptions {
	constructor() { 
		super();
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      	if (currentUser && currentUser.token) {
          this.headers = new Headers({ 'Authorization': `Bearer ${currentUser.token}` });
      	}
	}
}