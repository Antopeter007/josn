import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDetailsComponent } from './change-password-details.component';

describe('ChangePasswordDetailsComponent', () => {
  let component: ChangePasswordDetailsComponent;
  let fixture: ComponentFixture<ChangePasswordDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       TranslateModule.forRoot(),
  //       FormsModule,
  //       ReactiveFormsModule,
  //       RouterTestingModule,
  //       HttpClientModule,
  //       CookieModule.forRoot()
  //     ],
  //     declarations: [ChangePasswordDetailsComponent],
  //     schemas: [NO_ERRORS_SCHEMA],
  //     providers: [NgForm]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    //const comp = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
});

});
