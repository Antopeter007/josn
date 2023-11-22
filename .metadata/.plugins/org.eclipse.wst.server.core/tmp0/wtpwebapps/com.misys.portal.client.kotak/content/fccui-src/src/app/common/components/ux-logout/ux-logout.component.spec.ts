import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UxLogoutComponent } from './ux-logout.component';

describe('UxLogoutComponent', () => {
  let component: UxLogoutComponent;
  let fixture: ComponentFixture<UxLogoutComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       TranslateModule.forRoot(),
  //       FormsModule,
  //       ReactiveFormsModule,
  //       RouterTestingModule,
  //       HttpClientModule
  //     ],
  //     declarations: [UxLogoutComponent],
  //     schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //     providers: [CheckTimeoutService]
  //   }).compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a logout component', () => {
    expect(component).toBeTruthy();
  });
});
