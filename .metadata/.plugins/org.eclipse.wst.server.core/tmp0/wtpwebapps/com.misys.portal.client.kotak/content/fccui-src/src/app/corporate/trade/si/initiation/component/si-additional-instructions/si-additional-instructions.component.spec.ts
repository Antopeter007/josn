import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiAdditionalInstructionsComponent } from './si-additional-instructions.component';

describe('SiAdditionalInstructionsComponent', () => {
  let component: SiAdditionalInstructionsComponent;
  let fixture: ComponentFixture<SiAdditionalInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiAdditionalInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiAdditionalInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
