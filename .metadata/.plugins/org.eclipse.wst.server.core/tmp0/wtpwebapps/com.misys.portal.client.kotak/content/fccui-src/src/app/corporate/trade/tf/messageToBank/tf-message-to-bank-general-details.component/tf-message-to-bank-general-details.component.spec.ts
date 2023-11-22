import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfMessageToBankGeneralDetailsComponent } from './tf-message-to-bank-general-details.component';

describe('TfMessageToBankGeneralDetailsComponent', () => {
  let component: TfMessageToBankGeneralDetailsComponent;
  let fixture: ComponentFixture<TfMessageToBankGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfMessageToBankGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfMessageToBankGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
