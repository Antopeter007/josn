import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonUndertakingDetailsComponent } from './common-undertaking-details.component';

describe('CommonUndertakingDetailsComponent', () => {
  let component: CommonUndertakingDetailsComponent;
  let fixture: ComponentFixture<CommonUndertakingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonUndertakingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUndertakingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
