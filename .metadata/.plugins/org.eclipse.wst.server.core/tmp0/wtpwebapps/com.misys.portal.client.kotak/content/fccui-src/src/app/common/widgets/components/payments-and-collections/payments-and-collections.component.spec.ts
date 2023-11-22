import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsAndCollectionsComponent } from './payments-and-collections.component';

describe('PaymentsAndCollectionsComponent', () => {
  let component: PaymentsAndCollectionsComponent;
  let fixture: ComponentFixture<PaymentsAndCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsAndCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsAndCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
