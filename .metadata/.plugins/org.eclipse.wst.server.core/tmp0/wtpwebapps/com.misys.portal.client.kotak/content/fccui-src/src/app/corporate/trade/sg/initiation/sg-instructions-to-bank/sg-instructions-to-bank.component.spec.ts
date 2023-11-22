import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgInstructionsToBankComponent } from './sg-instructions-to-bank.component';

describe('SgInstructionsToBankComponent', () => {
  let component: SgInstructionsToBankComponent;
  let fixture: ComponentFixture<SgInstructionsToBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgInstructionsToBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgInstructionsToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
