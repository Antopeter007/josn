import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferConditionsComponent } from './transfer-conditions.component';

describe('TransferConditionsComponent', () => {
  let component: TransferConditionsComponent;
  let fixture: ComponentFixture<TransferConditionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TransferConditionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
