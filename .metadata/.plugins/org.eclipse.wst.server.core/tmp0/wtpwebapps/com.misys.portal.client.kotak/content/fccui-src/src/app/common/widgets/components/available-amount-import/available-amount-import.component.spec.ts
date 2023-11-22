import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableAmountImportComponent } from './available-amount-import.component';

describe('AvailableAmountImportComponent', () => {
  let component: AvailableAmountImportComponent;
  let fixture: ComponentFixture<AvailableAmountImportComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AvailableAmountImportComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableAmountImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
