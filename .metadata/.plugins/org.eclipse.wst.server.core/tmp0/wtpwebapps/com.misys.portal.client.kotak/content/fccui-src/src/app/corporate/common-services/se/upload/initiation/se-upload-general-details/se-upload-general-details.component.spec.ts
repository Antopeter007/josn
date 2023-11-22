import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeUploadGeneralDetailsComponent } from './se-upload-general-details.component';

describe('SeUploadGeneralDetailsComponent', () => {
  let component: SeUploadGeneralDetailsComponent;
  let fixture: ComponentFixture<SeUploadGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SeUploadGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeUploadGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
