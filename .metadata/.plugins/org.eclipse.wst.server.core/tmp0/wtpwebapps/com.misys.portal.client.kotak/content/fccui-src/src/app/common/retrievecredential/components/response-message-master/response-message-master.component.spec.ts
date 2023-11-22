import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseMessageMasterComponent } from './response-message-master.component';

describe('ResponseMessageMasterComponent', () => {
  let component: ResponseMessageMasterComponent;
  let fixture: ComponentFixture<ResponseMessageMasterComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ResponseMessageMasterComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseMessageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
