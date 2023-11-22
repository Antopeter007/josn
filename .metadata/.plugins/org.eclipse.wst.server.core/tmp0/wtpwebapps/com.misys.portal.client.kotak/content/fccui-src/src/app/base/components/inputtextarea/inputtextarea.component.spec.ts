import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputtextareaComponent } from './inputtextarea.component';

describe('InputtextareaComponent', () => {
  let component: InputtextareaComponent;
  let fixture: ComponentFixture<InputtextareaComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ InputtextareaComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputtextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ngonit of the component', () => {
    component.ngOnInit();
  });

  it('call the focus', () => {
    component.onFocus(eval);
  });

  it('call the blur', () => {
    component.onBlur(eval);
  });

});
