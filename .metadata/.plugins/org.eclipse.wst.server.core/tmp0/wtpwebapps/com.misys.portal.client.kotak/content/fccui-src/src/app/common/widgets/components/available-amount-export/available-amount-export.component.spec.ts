import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableAmountExportComponent } from './available-amount-export.component';

describe('AvailableAmountExportComponent', () => {
  let component: AvailableAmountExportComponent;
  let fixture: ComponentFixture<AvailableAmountExportComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AvailableAmountExportComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableAmountExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
