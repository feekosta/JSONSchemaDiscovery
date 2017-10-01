import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemesComponent } from './schemes.component';

describe('SchemesComponent', () => {
  let component: SchemesComponent;
  let fixture: ComponentFixture<SchemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
