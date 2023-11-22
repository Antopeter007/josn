import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmendGeneralDetailsComponent } from './amend-general-details.component';

describe('AmendGeneralDetailsComponent', () => {
  let component: AmendGeneralDetailsComponent;
  let fixture: ComponentFixture<AmendGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
