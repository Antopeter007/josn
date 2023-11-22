import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChequeStatusListingComponent } from './view-cheque-status-listing.component';

describe('ViewChequeStatusListingComponent', () => {
  let component: ViewChequeStatusListingComponent;
  let fixture: ComponentFixture<ViewChequeStatusListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewChequeStatusListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChequeStatusListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
