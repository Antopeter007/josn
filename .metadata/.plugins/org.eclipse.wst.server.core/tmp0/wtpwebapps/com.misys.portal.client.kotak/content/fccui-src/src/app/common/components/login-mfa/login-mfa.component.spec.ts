import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMfaComponent } from './login-mfa.component';

describe('LoginMfaComponent', () => {
  let component: LoginMfaComponent;
  let fixture: ComponentFixture<LoginMfaComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LoginMfaComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
  });
});


