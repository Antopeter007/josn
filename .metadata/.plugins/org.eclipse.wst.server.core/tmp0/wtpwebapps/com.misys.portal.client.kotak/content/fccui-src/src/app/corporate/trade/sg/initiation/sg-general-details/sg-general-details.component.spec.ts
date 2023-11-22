import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgGeneralDetailsComponent } from './sg-general-details.component';

describe('SgGeneralDetailsComponent', () => {
  let component: SgGeneralDetailsComponent;
  let fixture: ComponentFixture<SgGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
