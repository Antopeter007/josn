import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmendTwoColumnViewComponent } from './amend-two-column-view.component';

describe('AmendTwoColumnViewComponent', () => {
  let component: AmendTwoColumnViewComponent;
  let fixture: ComponentFixture<AmendTwoColumnViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendTwoColumnViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendTwoColumnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
