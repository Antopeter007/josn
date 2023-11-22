import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansOutstandingComponent } from './loans-outstanding.component';

describe('LoansOutstandingComponent', () => {
  let component: LoansOutstandingComponent;
  let fixture: ComponentFixture<LoansOutstandingComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LoansOutstandingComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoansOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
