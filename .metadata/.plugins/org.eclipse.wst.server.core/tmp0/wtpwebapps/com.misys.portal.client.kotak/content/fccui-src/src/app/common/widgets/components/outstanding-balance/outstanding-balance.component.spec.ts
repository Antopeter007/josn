import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingBalanceComponent } from './outstanding-balance.component';

describe('OutstandingBalanceComponent', () => {
  let component: OutstandingBalanceComponent;
  let fixture: ComponentFixture<OutstandingBalanceComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ OutstandingBalanceComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
