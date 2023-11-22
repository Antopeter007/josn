import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfInstructionsToBankComponent } from './tf-instructions-to-bank.component';

describe('TfInstructionsToBankComponent', () => {
  let component: TfInstructionsToBankComponent;
  let fixture: ComponentFixture<TfInstructionsToBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfInstructionsToBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfInstructionsToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
