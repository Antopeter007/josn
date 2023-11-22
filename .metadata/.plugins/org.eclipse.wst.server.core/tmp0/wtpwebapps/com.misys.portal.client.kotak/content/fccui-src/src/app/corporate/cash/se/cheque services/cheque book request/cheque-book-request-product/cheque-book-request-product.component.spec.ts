import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookRequestProductComponent } from './cheque-book-request-product.component';

describe('ChequeBookRequestProductComponent', () => {
  let component: ChequeBookRequestProductComponent;
  let fixture: ComponentFixture<ChequeBookRequestProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookRequestProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookRequestProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
