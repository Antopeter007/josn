import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  // beforeEach(waitForAsync()(() => {
  //   TestBed.configureTestingModule({
  //     imports: [RouterTestingModule, HttpClientModule],
  //     declarations: [AppComponent],
  //     providers: [CheckTimeoutService]
  //   }).compileComponents();
  // }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'FCMUI'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('FCMUI');
  });
});
