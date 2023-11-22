import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonGeneralDetailsComponent } from './common-general-details.component';

describe('CommonGeneralDetailsComponent', () => {
  let component: CommonGeneralDetailsComponent;
  let fixture: ComponentFixture<CommonGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
