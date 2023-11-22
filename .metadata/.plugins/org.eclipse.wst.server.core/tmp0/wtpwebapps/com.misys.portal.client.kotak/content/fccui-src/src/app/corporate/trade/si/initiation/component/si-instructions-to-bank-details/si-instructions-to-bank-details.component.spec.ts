import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiInstructionsToBankDetailsComponent } from './si-instructions-to-bank-details.component';

describe('SiInstructionsToBankDetailsComponent', () => {
  let component: SiInstructionsToBankDetailsComponent;
  let fixture: ComponentFixture<SiInstructionsToBankDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiInstructionsToBankDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiInstructionsToBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
