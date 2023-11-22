export class Login {
  public email: string;
  public corporateId: string;
  constructor() {
    this.email = null;
    this.corporateId = null;
  }
}

export class PasswordChange {
  public newPassword: string;
  public confirmPassword: string;
  constructor() {
    this.newPassword = null;
    this.confirmPassword = null;
  }
}
export class RetrieveUserReqData {
  details: Login;
  captcha: string;
  language: string;
  constructor() {
    this.details = new Login();
    this.captcha = null;
    this.language = null;
  }
}

export class ResetPasswordRequestData {
  details: Login;
  userId: string;
  captcha: string;
  otpSubmission: string;
  language: string;
  mode: string;
  password: PasswordChange;
  constructor() {
    this.details = new Login();
    this.userId = null;
    this.captcha = null;
    this.otpSubmission = null;
    this.language = null;
    this.mode = null;
    this.password = new PasswordChange();
  }
}


