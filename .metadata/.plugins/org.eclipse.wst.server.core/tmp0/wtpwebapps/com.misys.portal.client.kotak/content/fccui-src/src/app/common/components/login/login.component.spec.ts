
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {
  UntypedFormGroup
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const commonService = jasmine.createSpyObj({ CommonService: null });
  const loginService = jasmine.createSpyObj({ loginService: null });

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       TranslateModule.forRoot(),
  //       FormsModule,
  //       ReactiveFormsModule,
  //       RouterTestingModule,
  //       HttpClientModule,
  //       CookieModule.forRoot(),
  //       DropdownModule,
  //       ButtonModule
  //     ],
  //     declarations: [LoginComponent],
  //     schemas: [NO_ERRORS_SCHEMA],
  //     providers: [NgForm, ResponseService, CheckTimeoutService, SessionValidateService, LogoutService, BnNgIdleService,
  //                 CookieService, CommonService, AppComponent, DialogService, LoginService]
  //   }).compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Login compoent created for testing , this test case required....
  it('should create a login component', () => {
    expect(component).toBeTruthy();
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'Config').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.Config).toHaveBeenCalled();
  });

  it('call the onBlurUserMethod component', () => {
    const buttonDE = fixture.debugElement.query( By.css('#username'));
    buttonDE.triggerEventHandler('blur', null);
    component.loginForm.controls.username.setValue('ccust');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.onBlurUserMethod).toHaveBeenCalled();
    });
  });

  it('call the onBlurCorporateMethod component', () => {
    const buttonDE = fixture.debugElement.query( By.css('#corporateid'));
    buttonDE.triggerEventHandler('blur', null);
    component.loginForm.controls.corporateid.setValue('ccust');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.onBlurCorporateMethod).toHaveBeenCalled();
    });
  });

  it('call the switchLanguage component', () => {
    spyOn(component, 'onBlurUserMethod').and.callThrough();
    component.switchLanguage('e');
    expect(component.switchLanguage).toHaveBeenCalledWith('e');
  });

  it('call the initIdleTimer component', () => {
    spyOn(component, 'initIdleTimer').and.callThrough();
    component.initIdleTimer();
    expect(component.initIdleTimer).toHaveBeenCalled();
  });

  // it('should render the logo', async(() => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('div.logo-img>a>img').src).toBeTruthy();
  // }));

  it('should have a login form', () => {
    expect(component.loginForm instanceof UntypedFormGroup).toBeTruthy();
  });

  it('should have various form fields in Login form', () => {
    const fields = {
      corporateid: 'someID',
      username: 'John Doe',
      password: 'password'
    };
    Object.keys(fields).forEach((v) => {
      component.loginForm.controls[v].setValue(fields[v]);
      expect(component.loginForm.value[v]).toBe(fields[v]);
    });
  });

  it('f should do something', () => {
    expect(component.f).toEqual(component.loginForm.controls);
  });

  it('should login onSubmitLogin', () => {
    component.loginUserSelectedLanguage = null || 'en' ;
    const formlogin = fixture.debugElement.query( By.css('form'));
    formlogin.triggerEventHandler('ngSubmit', {});
    spyOn(commonService, 'login' ).and.returnValue(of({
      mode: '',
      company: 'CCUST',
      user: 'CCUST / User A',
      objectData: {},
      response: 'success',
      errorMessage: null
    }));
    spyOn(component, 'initIdleTimer');
    spyOn(commonService, 'checkLandingPage');
    component.onSubmitLogin({});
    expect(commonService.login).toHaveBeenCalled();
    expect(component.initIdleTimer).toHaveBeenCalled();
    expect(commonService.checkLandingPage).toHaveBeenCalled();
  });

  it('should open change_password Screen onSubmitLogin', () => {
    component.loginUserSelectedLanguage = null || 'en' ;
    const formlogin = fixture.debugElement.query( By.css('form'));
    formlogin.triggerEventHandler('ngSubmit', {});
    spyOn(commonService, 'login' ).and.returnValue(of({
      mode: 'change_password_qa',
      company: 'CCUST',
      user: 'CCUST / User A',
      objectData: {},
      response: 'success',
      errorMessage: null
    }));
    spyOn(component, 'initIdleTimer');
    spyOn(loginService, 'setNextComponent');
    component.onSubmitLogin({});
    expect(commonService.login).toHaveBeenCalled();
    expect(component.initIdleTimer).toHaveBeenCalled();
    expect(loginService.setNextComponent).toHaveBeenCalled();
  });

  it('should open update_password Screen onSubmitLogin', () => {
    component.loginUserSelectedLanguage = null || 'en' ;
    const formlogin = fixture.debugElement.query( By.css('form'));
    formlogin.triggerEventHandler('ngSubmit', {});
    spyOn(commonService, 'login' ).and.returnValue(of({
      mode: 'change_password',
      company: 'CCUST',
      user: 'CCUST / User A',
      objectData: {},
      response: 'success',
      errorMessage: null
    }));
    spyOn(component, 'initIdleTimer');
    spyOn(loginService, 'setNextComponent');
    component.onSubmitLogin({});
    expect(commonService.login).toHaveBeenCalled();
    expect(component.initIdleTimer).toHaveBeenCalled();
    expect(loginService.setNextComponent).toHaveBeenCalled();
  });

  it('should open terms_and_contitions Screen onSubmitLogin', () => {
    component.loginUserSelectedLanguage = null || 'en' ;
    const formlogin = fixture.debugElement.query( By.css('form'));
    formlogin.triggerEventHandler('ngSubmit', {});
    spyOn(commonService, 'login' ).and.returnValue(of({
      mode: 'change_passw',
        company: 'CCUST',
        user: 'CCUST / User A',
        objectData: {
            tandctext: {
                // eslint-disable-next-line max-len
                1: 'The Customer undertakes to procure:that no person shall be permitted or shall have access or knowledge of any User ID or Password of any Customer User except such Customer User;that each Customer User:shall keep confidential and not divulge to any person the User ID and/or Password of such Customer User;shall immediately memorise that User ID and Password and destroy the envelope or document in which that User ID and Password are stated;shall not record that User ID and/or Password in any form; and shall immediately after such Customer User has reason to believe that any person may have acquired knowledge of that User ID and/or Password notify each Demo Group Bank thereof.',
                // eslint-disable-next-line max-len
                2: 'Each Demo Group Bank shall be entitled to rely on and treat any Instruction made, submitted or effected pursuant to the entry or use of the User ID and the Password of any Customer User or that Password alone (and whether or not in conjunction with or generated by any Security Token or otherwise) as having been made, submitted or effected by that Customer User for and on behalf of the Customer unless notice of the disclosure or unauthorised use of the User ID and Password to effect any Instruction has been given by the Customer or that Customer User in such form and by such means as the Demo Group Bank may deem satisfactory and has been received by the Demo Group Bank within such amount of time in advance of such Instruction as the Demo Group Bank would reasonably require (having regard to all the circumstances then prevailing) to enable it to take appropriate action to prevent such Instruction from being received, acted upon and implemented.',
                // eslint-disable-next-line max-len
                3: 'The Customer agrees to comply with and to procure that the Customer Users comply with the terms of this Agreement and any other instructions or recommendations each Demo Group Bank may issue to the Customer regarding security in relation to use of Business Internet Banking and the Services.The Customer acknowledges that security is a paramount concern in its access to and use of the Business Internet Banking and/or the Services and agrees that it is solely responsible for the set-up, maintenance and review of its security arrangements concerning access to and use of Business Internet Banking and the Services, its telecommunication, computer or other electronic equipment or system and information stored therein and the Customer’s and any of the Customer Users’ control of User ID, Passwords, Security Tokens and access to Business Internet Banking and/or the Services.',
                // eslint-disable-next-line max-len
                4: 'The Customer and/or the Customer Users must notify the relevant Demo Group Bank immediately if the Customer or any Customer User knows of or suspects any unauthorised access to Business Internet Banking and/or the Services or any unauthorised transaction or Instruction or if the Customer suspects someone else knows the User ID and Passwords of one or more of the Customer Users and/or has access to their Security Tokens. In the event of any such breach or suspected breach of security, the Customer must ensure that all the Customer Users change their Passwords immediately. The Customer agrees to comply immediately with all reasonable requests for assistance from the Demo Group Bank and/or the police in trying to recover any losses or identify actual or potential breaches of security.If a Customer User is leaving the employ of the Customer or is no longer authorised or instructed by the Customer to utilise Business Internet Banking and/or the Services for any reason whatsoever or if the Customer suspects any impropriety on the part of any Customer User in connection with the use of Business Internet Banking and/or the Services, the Customer must immediately:',
                // eslint-disable-next-line max-len
                5: 'Inform the relevant Demo Group Bank of any aforesaid eventuality; take all steps to ensure that the Customer User is replaced; and prevent further access to Business Internet Banking and/or the Services, including but not limited to submitting a request or instruction to the Demo Group Bank to revoke the Customer User’s User ID and Password. The Customer hereby request and authorise the relevant Demo Group Bank from time to time without further authority or notice from the Customer to act upon any request or instruction to re-set any User ID, Password or to revoke and/or deactivate any Security Token of a Customer User, or to issue and/or replace a Security Token of any Customer User to specify mode of which the Customer can make such request or instruction. In addition, the Customer agrees that the Demo Group Bank shall not be liable to the Customer or any third party for any loss or damage suffered by the Customer or any third party arising from any such request or instruction being unauthorised or fraudulent.',
                // eslint-disable-next-line max-len
                6: 'The Customer shall ensure that: any person appointed by the Customer as the Customer User has sufficient knowledge and skill to properly operate and maintain all equipment and software installed or used by the Customer to enable the Customer to access and utilise Business Internet Banking and the Services; every Customer User acquires full and complete knowledge of all features and settings of all BIB Software before the Customer commences utilising Business Internet Banking or any Service; The Customer shall be responsible for all the actions of the Customer User. Company Signatories, Mandate Change and Corporate Resolution. This Agreement shall apply and continue to apply notwithstanding any mandate of the Customer which may have been given or which may be subsequently given to or accepted by the Demo Group Bank with respect to any Account or Service (whether currently or subsequently maintained with the Bank).The Customer shall pay each Demo Group Bank all its fees, commissions and other charges at such rates and in such manner as the Demo Group Bank may impose and stipulate from time to time with respect to: the provision of the Services;',
                // eslint-disable-next-line max-len
                7: 'The execution or implementation of any Instruction; such other matters and transactions as it may determine from time to time. The Customer also agrees to refer to and to treat all such records or logs, tapes, cartridges, computer printouts, copies or other form of information storage as conclusive evidence of all Customer Instructions and other communications received or sent by any Demo Group Bank. The Customer further agrees that all such records shall be binding upon the Customer and that the Customer will not be entitled to dispute the validity or authenticity of the same. All Instructions and communications that meet the operating standards and requirements of any Demo Group Bank shall be deemed to be as good as, and given the same effect as, written and/or signed documentary communications by the Demo Group Bank. Governing Law And Jurisdiction. This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.',
                // eslint-disable-next-line max-len
                8: 'The Customer shall not commence or continue any legal proceedings against any Demo Group Bank in any jurisdiction other than in Singapore with respect to any matter, claim or dispute so long as that Demo Group Bank is prepared to submit to the jurisdiction of the courts of Singapore with respect to that matter, claim or dispute and the Customer shall before commencing proceedings against that Demo Group Bank in any jurisdiction with respect to any matter, claim or dispute other than Singapore seek that Demo Group Bank’s agreement to submit to that foreign jurisdiction with respect thereto. Service of any process or document by which any proceedings in any court in Singapore are commenced may be effected in any manner permitted for communications hereunder.'
        },
        response: 'success',
        errorMessage: null
    }
    }));
    spyOn(component, 'initIdleTimer');
    spyOn(loginService, 'setNextComponent');
    component.onSubmitLogin({});
    expect(commonService.login).toHaveBeenCalled();
    expect(component.initIdleTimer).toHaveBeenCalled();
    expect(loginService.setNextComponent).toHaveBeenCalled();
  });

  // it(`call the passwordChange component to show the toast message`, async(() => {
  //   sessionStorage.setItem('passwordReset', 'change_password');
  //   spyOn(component, 'passwordChange').and.callThrough();
  //   component.passwordChange();
  //   expect(component.passwordChange).toHaveBeenCalled();
  // }));

  // it(`should have a configuredKeysList`, async(() => {
  //   fixture = TestBed.createComponent(LoginComponent);
  //   component = fixture.debugElement.componentInstance;
  //   expect(component.configuredKeysList).toEqual('AVAILABLE_LANGUAGES,LANGUAGE');
  // }));

  afterEach(() => {
    TestBed.resetTestingModule();
    component = null;
    sessionStorage.removeItem('passwordReset');
  });

});


