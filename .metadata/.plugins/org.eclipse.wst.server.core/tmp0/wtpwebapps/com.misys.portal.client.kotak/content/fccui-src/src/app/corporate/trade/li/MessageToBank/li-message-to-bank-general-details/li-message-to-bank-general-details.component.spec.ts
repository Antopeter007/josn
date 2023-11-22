import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiMessageToBankGeneralDetailsComponent } from './li-message-to-bank-general-details.component';

describe('LiMessageToBankGeneralDetailsComponent', () => {
  let component: LiMessageToBankGeneralDetailsComponent;
  let fixture: ComponentFixture<LiMessageToBankGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiMessageToBankGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiMessageToBankGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
