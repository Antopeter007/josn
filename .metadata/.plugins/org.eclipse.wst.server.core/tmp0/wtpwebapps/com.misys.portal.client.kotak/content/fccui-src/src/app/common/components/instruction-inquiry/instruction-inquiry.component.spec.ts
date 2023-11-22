import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionInquiryComponent } from './instruction-inquiry.component';

describe('InstructionInquiryComponent', () => {
  let component: InstructionInquiryComponent;
  let fixture: ComponentFixture<InstructionInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionInquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
