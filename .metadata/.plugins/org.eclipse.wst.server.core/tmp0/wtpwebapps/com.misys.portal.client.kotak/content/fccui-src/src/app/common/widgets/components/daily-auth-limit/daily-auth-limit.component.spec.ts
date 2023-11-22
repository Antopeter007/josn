import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAuthLimitComponent } from './daily-auth-limit.component';

describe('DailyAuthLimitComponent', () => {
  let component: DailyAuthLimitComponent;
  let fixture: ComponentFixture<DailyAuthLimitComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DailyAuthLimitComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAuthLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
