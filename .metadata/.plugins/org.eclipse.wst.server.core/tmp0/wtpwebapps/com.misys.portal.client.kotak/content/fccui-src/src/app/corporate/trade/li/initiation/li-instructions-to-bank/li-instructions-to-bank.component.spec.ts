import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiInstructionsToBankComponent } from './li-instructions-to-bank.component';

describe('LiInstructionsToBankComponent', () => {
  let component: LiInstructionsToBankComponent;
  let fixture: ComponentFixture<LiInstructionsToBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiInstructionsToBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiInstructionsToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
