import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RuMessageToBankComponent } from './ru-message-to-bank.component';

describe('RuMessageToBankComponent', () => {
  let component: RuMessageToBankComponent;
  let fixture: ComponentFixture<RuMessageToBankComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RuMessageToBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuMessageToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
