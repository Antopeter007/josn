import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPartyComponent } from './confirmation-party.component';

describe('ConfirmationPartyComponent', () => {
  let component: ConfirmationPartyComponent;
  let fixture: ComponentFixture<ConfirmationPartyComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ConfirmationPartyComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
