import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IrregularReductionIncreaseDialogComponent } from './irregular-reduction-increase-dialog.component';

describe('IrregularReductionIncreaseDialogComponent', () => {
  let component: IrregularReductionIncreaseDialogComponent;
  let fixture: ComponentFixture<IrregularReductionIncreaseDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IrregularReductionIncreaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrregularReductionIncreaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
