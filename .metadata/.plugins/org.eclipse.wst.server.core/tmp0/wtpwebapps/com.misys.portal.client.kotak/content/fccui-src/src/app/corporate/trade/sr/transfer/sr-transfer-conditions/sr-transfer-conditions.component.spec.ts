import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrTransferConditionsComponent } from './sr-transfer-conditions.component';

describe('SrTransferConditionsComponent', () => {
  let component: SrTransferConditionsComponent;
  let fixture: ComponentFixture<SrTransferConditionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrTransferConditionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrTransferConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
