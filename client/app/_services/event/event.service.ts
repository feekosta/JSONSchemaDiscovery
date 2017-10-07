import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EventService {

	private isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    isLoggedEmitter: Observable<boolean> = this.isLogged.asObservable();

 	constructor() { }

 	setIsLogged(isLogged: boolean) {
        this.isLogged.next(isLogged);
    }

}
