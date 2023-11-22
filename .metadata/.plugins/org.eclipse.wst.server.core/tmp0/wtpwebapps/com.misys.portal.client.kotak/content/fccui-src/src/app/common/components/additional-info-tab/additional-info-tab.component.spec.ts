import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoTabComponent } from './additional-info-tab.component';

describe('AdditionalInfoTabComponent', () => {
  let component: AdditionalInfoTabComponent;
  let fixture: ComponentFixture<AdditionalInfoTabComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AdditionalInfoTabComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
