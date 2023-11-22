import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcGeneralDetailsComponent } from './ic-general-details.component';

describe('IcGeneralDetailsComponent', () => {
  let component: IcGeneralDetailsComponent;
  let fixture: ComponentFixture<IcGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IcGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
