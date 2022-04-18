import { Injectable } from '@angular/core';
import { User } from '../../_models/user';
import { LoadingService } from '../loading/loading.service';
import {HttpClient} from '@angular/common/http';

import { map, finalize } from 'rxjs/operators';

@Injectable()
export class RegistrationService {

  private baseUrl = '/api/';
  private registerUrl: string = this.baseUrl + 'register';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  register(user: User) {
    this.loadingService.show();
    return this.http.post<User>(this.registerUrl, user)
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

}
