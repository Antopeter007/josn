import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInstructionsComponent } from './additional-instructions.component';

describe('AdditionalInstructionsComponent', () => {
  let component: AdditionalInstructionsComponent;
  let fixture: ComponentFixture<AdditionalInstructionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ AdditionalInstructionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
