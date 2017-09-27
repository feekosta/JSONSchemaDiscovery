import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

@Injectable()
export class EventService {

	private showNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public showNavBarEmitter: Observable<boolean> = this.showNavBar.asObservable();

 	constructor() { }

 	setShowNavBar(ifShow: boolean) {
        this.showNavBar.next(ifShow);
    }

}
