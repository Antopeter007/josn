import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcMessageToBankGeneralDetailsComponent } from './ec-message-to-bank-general-details.component';

describe('EcMessageToBankGeneralDetailsComponent', () => {
  let component: EcMessageToBankGeneralDetailsComponent;
  let fixture: ComponentFixture<EcMessageToBankGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcMessageToBankGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcMessageToBankGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
