import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingState, LoadingService } from '../../_services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnDestroy, OnInit {

  public visible = false;
  private _loadingStateChanged: Subscription;

  constructor(private _loadingService: LoadingService) { }

  ngOnInit() {
    this._loadingStateChanged = this._loadingService.loadingState
      .subscribe((state: LoadingState) => this.visible = state.show);
  }

  ngOnDestroy() {
    this._loadingStateChanged.unsubscribe();
  }

}
