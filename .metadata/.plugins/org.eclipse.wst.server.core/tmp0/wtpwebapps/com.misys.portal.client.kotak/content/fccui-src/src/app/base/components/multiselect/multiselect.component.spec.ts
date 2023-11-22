import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectComponent } from './multiselect.component';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let f: any;
  let fixture: ComponentFixture<MultiselectComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ MultiselectComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ngonit of the component ', () => {
    component.ngOnInit();
  });

  it('call the onchange  ', () => {
    component.onChange(eval);
  });

  it('call the registerOnChange ', () => {
    component.registerOnChange(f());
  });

});
