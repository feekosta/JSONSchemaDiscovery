import { Injectable } from '@angular/core';
import { LoadingService } from '../loading/loading.service';
import {HttpClient} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {User} from './user';


@Injectable()
export class UserService {

  private baseUrl = '/api/user';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  get() {
    this.loadingService.show();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const headers = { 'Authorization': `Bearer ${currentUser.token}` };
    return this.http.get<User>(this.baseUrl, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

}
