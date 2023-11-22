import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsListdefComponent } from './transactions-listdef.component';

describe('TransactionsListdefComponent', () => {
  let component: TransactionsListdefComponent;
  let fixture: ComponentFixture<TransactionsListdefComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TransactionsListdefComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsListdefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
