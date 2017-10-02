import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchDeleteModalComponent } from './batch-delete-modal.component';

describe('BatchDeleteModalComponent', () => {
  let component: BatchDeleteModalComponent;
  let fixture: ComponentFixture<BatchDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
