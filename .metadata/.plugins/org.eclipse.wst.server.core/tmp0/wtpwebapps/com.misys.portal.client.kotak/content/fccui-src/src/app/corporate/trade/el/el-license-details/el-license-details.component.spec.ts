import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElLicenseDetailsComponent } from './el-license-details.component';

describe('ElLicenseDetailsComponent', () => {
  let component: ElLicenseDetailsComponent;
  let fixture: ComponentFixture<ElLicenseDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ElLicenseDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
