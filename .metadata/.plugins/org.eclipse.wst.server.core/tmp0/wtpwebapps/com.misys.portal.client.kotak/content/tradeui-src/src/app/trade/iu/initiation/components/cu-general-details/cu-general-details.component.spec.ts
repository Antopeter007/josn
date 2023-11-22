import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuGeneralDetailsComponent } from './cu-general-details.component';

describe('CuGeneralDetailsComponent', () => {
  let component: CuGeneralDetailsComponent;
  let fixture: ComponentFixture<CuGeneralDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuGeneralDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
