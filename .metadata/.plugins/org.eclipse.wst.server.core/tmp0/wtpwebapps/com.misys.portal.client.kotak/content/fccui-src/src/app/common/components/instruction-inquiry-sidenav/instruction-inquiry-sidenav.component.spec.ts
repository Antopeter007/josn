import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionInquirySidenavComponent } from './instruction-inquiry-sidenav.component';

describe('InstructionInquirySidenavComponent', () => {
  let component: InstructionInquirySidenavComponent;
  let fixture: ComponentFixture<InstructionInquirySidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionInquirySidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionInquirySidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
