import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddChargesDialogComponent } from './add-charges-dialog.component';

describe('AddChargesDialogComponent', () => {
  let component: AddChargesDialogComponent;
  let fixture: ComponentFixture<AddChargesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChargesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChargesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
