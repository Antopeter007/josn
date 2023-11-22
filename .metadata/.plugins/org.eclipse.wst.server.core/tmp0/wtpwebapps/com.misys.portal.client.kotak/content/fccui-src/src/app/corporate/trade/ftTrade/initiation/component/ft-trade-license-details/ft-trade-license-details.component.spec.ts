import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTradeLicenseDetailsComponent } from './ft-trade-license-details.component';

describe('FtTradeLicenseDetailsComponent', () => {
  let component: FtTradeLicenseDetailsComponent;
  let fixture: ComponentFixture<FtTradeLicenseDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ FtTradeLicenseDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtTradeLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
