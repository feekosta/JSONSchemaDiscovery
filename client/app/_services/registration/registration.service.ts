import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../../_models/user';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class RegistrationService {

    private baseUrl: string = "/api/";
    private registerUrl: string = this.baseUrl+"register";

	constructor(private http: Http, private loadingService: LoadingService) { }

	register(user: User) {
        this.loadingService.show();
		return this.http.post(this.registerUrl, user)
			.map((response: Response) => response.json())
            .finally(() => this.loadingService.hide());
	}
}
