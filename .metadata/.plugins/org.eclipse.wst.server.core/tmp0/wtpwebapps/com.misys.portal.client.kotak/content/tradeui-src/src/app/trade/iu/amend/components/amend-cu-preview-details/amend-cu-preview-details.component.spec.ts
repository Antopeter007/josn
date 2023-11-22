import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmendCuPreviewDetailsComponent } from './amend-cu-preview-details.component';

describe('AmendCuPreviewDetailsComponent', () => {
  let component: AmendCuPreviewDetailsComponent;
  let fixture: ComponentFixture<AmendCuPreviewDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendCuPreviewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendCuPreviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
