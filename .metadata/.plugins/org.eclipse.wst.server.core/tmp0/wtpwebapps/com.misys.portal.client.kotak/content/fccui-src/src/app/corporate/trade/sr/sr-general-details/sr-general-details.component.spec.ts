import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrGeneralDetailsComponent } from './sr-general-details.component';

describe('SrGeneralDetailsComponent', () => {
  let component: SrGeneralDetailsComponent;
  let fixture: ComponentFixture<SrGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SrGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
