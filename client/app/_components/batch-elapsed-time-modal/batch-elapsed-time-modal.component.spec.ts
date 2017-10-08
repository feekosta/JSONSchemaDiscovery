import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchElapsedTimeModalComponent } from './batch-elapsed-time-modal.component';

describe('BatchElapsedTimeModalComponent', () => {
  let component: BatchElapsedTimeModalComponent;
  let fixture: ComponentFixture<BatchElapsedTimeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchElapsedTimeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchElapsedTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
