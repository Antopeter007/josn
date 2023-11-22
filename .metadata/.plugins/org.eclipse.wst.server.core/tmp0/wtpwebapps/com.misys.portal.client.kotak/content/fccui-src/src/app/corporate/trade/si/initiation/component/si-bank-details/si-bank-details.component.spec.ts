import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiBankDetailsComponent } from './si-bank-details.component';

describe('SiBankDetailsComponent', () => {
  let component: SiBankDetailsComponent;
  let fixture: ComponentFixture<SiBankDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiBankDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
