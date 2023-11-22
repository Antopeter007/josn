import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LnGeneralDetailsComponent } from './ln-general-details.component';

describe('LnGeneralDetailsComponent', () => {
  let component: LnGeneralDetailsComponent;
  let fixture: ComponentFixture<LnGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LnGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LnGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
