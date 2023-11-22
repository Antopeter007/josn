import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiGeneralDetailsComponent } from './si-general-details.component';

describe('SiGeneralDetailsComponent', () => {
  let component: SiGeneralDetailsComponent;
  let fixture: ComponentFixture<SiGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SiGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
