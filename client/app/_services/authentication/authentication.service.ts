import { Injectable } from '@angular/core';
import { LoadingService } from '../loading/loading.service';
import {finalize, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Authentication} from './authentication';

@Injectable()
export class AuthenticationService {

  private baseUrl = '/api/';
  private loginUrl: string = this.baseUrl + 'login';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  login(email: string, password: string) {
    this.loadingService.show();
    return this.http.post<Authentication>(this.loginUrl, { 'email': email, 'password': password }).pipe(
      map((user: Authentication) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

}
