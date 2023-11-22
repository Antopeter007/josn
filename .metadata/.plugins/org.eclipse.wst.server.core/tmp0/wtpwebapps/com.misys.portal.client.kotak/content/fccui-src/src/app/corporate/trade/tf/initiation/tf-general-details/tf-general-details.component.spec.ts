import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfGeneralDetailsComponent } from './tf-general-details.component';

describe('TfGeneralDetailsComponent', () => {
  let component: TfGeneralDetailsComponent;
  let fixture: ComponentFixture<TfGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
