import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface LoadingState {
  show: boolean;
}

@Injectable()
export class LoadingService {

  private loadingSubject = new Subject();
  loadingState = <Observable<LoadingState>>this.loadingSubject;

  constructor() { }

  show() {
    this.loadingSubject.next(<LoadingState>{ show: true });
  }

  hide() {
    this.loadingSubject.next(<LoadingState>{ show: false });
  }

}
