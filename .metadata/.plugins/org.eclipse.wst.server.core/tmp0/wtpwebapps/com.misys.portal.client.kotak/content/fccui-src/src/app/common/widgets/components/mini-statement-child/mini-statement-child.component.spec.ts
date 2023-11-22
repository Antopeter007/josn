import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniStatementChildComponent } from './mini-statement-child.component';

describe('MiniStatementChildComponent', () => {
  let component: MiniStatementChildComponent;
  let fixture: ComponentFixture<MiniStatementChildComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ MiniStatementChildComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniStatementChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
