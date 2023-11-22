import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiConfirmationPartyComponent } from './si-confirmation-party.component';

describe('SiConfirmationPartyComponent', () => {
  let component: SiConfirmationPartyComponent;
  let fixture: ComponentFixture<SiConfirmationPartyComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiConfirmationPartyComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiConfirmationPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
