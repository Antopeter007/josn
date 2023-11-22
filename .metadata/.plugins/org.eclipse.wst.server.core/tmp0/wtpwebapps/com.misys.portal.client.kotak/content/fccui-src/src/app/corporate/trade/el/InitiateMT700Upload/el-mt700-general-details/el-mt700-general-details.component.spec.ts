import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElMT700GeneralDetailsComponent } from './el-mt700-general-details.component';

describe('ElMT700GeneralDetailsComponent', () => {
  let component: ElMT700GeneralDetailsComponent;
  let fixture: ComponentFixture<ElMT700GeneralDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElMT700GeneralDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElMT700GeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
