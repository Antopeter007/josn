import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookRequestGeneralDetailsComponent } from './cheque-book-request-general-details.component';

describe('ChequeBookRequestGeneralDetailsComponent', () => {
  let component: ChequeBookRequestGeneralDetailsComponent;
  let fixture: ComponentFixture<ChequeBookRequestGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookRequestGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookRequestGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
