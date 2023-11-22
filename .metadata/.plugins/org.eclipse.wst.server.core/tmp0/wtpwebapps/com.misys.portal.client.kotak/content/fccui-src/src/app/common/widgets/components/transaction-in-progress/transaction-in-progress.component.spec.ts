import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInProgressComponent } from './transaction-in-progress.component';

describe('TransactionInProgressComponent', () => {
  let component: TransactionInProgressComponent;
  let fixture: ComponentFixture<TransactionInProgressComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TransactionInProgressComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
