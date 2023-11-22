import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterViewDetailComponent } from './master-view-detail.component';

describe('MasterViewDetailComponent', () => {
  let component: MasterViewDetailComponent;
  let fixture: ComponentFixture<MasterViewDetailComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ MasterViewDetailComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
