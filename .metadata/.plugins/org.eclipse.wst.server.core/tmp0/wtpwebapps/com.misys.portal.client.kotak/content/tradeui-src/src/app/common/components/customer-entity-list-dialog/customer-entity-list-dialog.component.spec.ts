import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerEntityListDialogComponent } from './customer-entity-list-dialog.component';

describe('CustomerEntityListDialogComponent', () => {
  let component: CustomerEntityListDialogComponent;
  let fixture: ComponentFixture<CustomerEntityListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEntityListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEntityListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
