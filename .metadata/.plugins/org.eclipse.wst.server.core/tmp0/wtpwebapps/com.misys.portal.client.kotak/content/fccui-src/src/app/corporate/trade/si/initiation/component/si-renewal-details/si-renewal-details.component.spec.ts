import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiRenewalDetailsComponent } from './si-renewal-details.component';

describe('SiRenewalDetailsComponent', () => {
  let component: SiRenewalDetailsComponent;
  let fixture: ComponentFixture<SiRenewalDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiRenewalDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiRenewalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
