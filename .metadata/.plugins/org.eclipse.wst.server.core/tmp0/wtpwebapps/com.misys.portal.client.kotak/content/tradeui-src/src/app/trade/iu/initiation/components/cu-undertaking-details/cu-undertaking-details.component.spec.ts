import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CuUndertakingDetailsComponent } from './cu-undertaking-details.component';

describe('CuUndertakingDetailsComponent', () => {
  let component: CuUndertakingDetailsComponent;
  let fixture: ComponentFixture<CuUndertakingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuUndertakingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuUndertakingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
