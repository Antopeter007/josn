import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElGeneralDetailsComponent } from './el-general-details.component';

describe('ElGeneralDetailsComponent', () => {
  let component: ElGeneralDetailsComponent;
  let fixture: ComponentFixture<ElGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ElGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
