import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiMessageToBankGeneralDetailsComponent } from './si-message-to-bank-general-details.component';

describe('SiMessageToBankGeneralDetailsComponent', () => {
  let component: SiMessageToBankGeneralDetailsComponent;
  let fixture: ComponentFixture<SiMessageToBankGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiMessageToBankGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiMessageToBankGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
