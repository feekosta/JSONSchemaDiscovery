import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../../_models/user';
import { LoadingService } from '../loading/loading.service';
import { AuthorizationParam } from '../../_params/params';


@Injectable()
export class UserService {

  	private baseUrl: string = "/api/user";

	constructor(private http: Http, private loadingService: LoadingService) { }

	get() {
        this.loadingService.show();
		return this.http.get(this.baseUrl, this.jwt())
			.map((response: Response) => response.json())
            .finally(() => this.loadingService.hide());
	}

	private jwt() {
		return new AuthorizationParam();
	}

}
