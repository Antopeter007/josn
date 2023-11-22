import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcGeneralDetailsComponent } from './ec-general-details.component';

describe('EcGeneralDetailsComponent', () => {
  let component: EcGeneralDetailsComponent;
  let fixture: ComponentFixture<EcGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
