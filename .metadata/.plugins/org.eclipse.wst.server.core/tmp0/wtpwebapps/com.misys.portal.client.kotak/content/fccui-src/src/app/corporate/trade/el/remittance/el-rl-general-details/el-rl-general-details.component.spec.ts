import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElRlGeneralDetailsComponent } from './el-rl-general-details.component';

describe('ElRlGeneralDetailsComponent', () => {
  let component: ElRlGeneralDetailsComponent;
  let fixture: ComponentFixture<ElRlGeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElRlGeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElRlGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
