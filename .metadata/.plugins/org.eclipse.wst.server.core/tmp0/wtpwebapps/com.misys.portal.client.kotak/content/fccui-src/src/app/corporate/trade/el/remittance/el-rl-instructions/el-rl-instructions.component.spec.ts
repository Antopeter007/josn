import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElRlInstructionsComponent } from './el-rl-instructions.component';

describe('ElRlInstructionsComponent', () => {
  let component: ElRlInstructionsComponent;
  let fixture: ComponentFixture<ElRlInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElRlInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElRlInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
