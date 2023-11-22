import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RuReductionIncreaseComponent } from './ru-reduction-increase.component';

describe('RuReductionIncreaseComponent', () => {
  let component: RuReductionIncreaseComponent;
  let fixture: ComponentFixture<RuReductionIncreaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RuReductionIncreaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuReductionIncreaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
