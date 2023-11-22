import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [BrowserAnimationsModule, HttpClientTestingModule, TranslateModule.forRoot()],
  //     declarations: [ FooterComponent ],
  //     providers: [TranslateService],
  //     schemas: [NO_ERRORS_SCHEMA]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('call to ngoninit of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
  });

});
