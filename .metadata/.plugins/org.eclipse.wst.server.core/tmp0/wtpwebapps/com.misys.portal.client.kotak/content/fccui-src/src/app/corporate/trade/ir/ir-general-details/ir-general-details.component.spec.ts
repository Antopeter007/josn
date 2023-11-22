import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrGeneralDetailsComponent } from './ir-general-details.component';

describe('IrGeneralDetailsComponent', () => {
  let component: IrGeneralDetailsComponent;
  let fixture: ComponentFixture<IrGeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ IrGeneralDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrGeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
