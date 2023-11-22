import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDetailsComponent } from './general-details.component';

describe('GeneralDetailsComponent', () => {
  let component: GeneralDetailsComponent;
  let fixture: ComponentFixture<GeneralDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ GeneralDetailsComponent ],
  //     schemas: [NO_ERRORS_SCHEMA],
  //     imports: [ ReactiveFormsModule, CalendarModule, RadioButtonModule, DragDropModule, DropdownModule,
  //           InputSwitchModule, MultiSelectModule, SelectButtonModule, ProgressBarModule, MessagesModule, MessageModule,
  //           InputTextareaModule, HttpClientTestingModule, RouterModule, RouterTestingModule, TranslateModule.forRoot({
  //             loader: {
  //               provide: TranslateLoader,
  //               useClass: TranslateFakeLoader
  //             }
  //     })],
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('variable declaration' , () => {
    expect(component.module);
    expect(component.contextPath);
    expect(component.checked);
    expect(component.progressivebar);
    expect(component.btndisable);
    expect(component.params);
    expect(component.checker);
    expect(component.checkIcons);
    expect(component.blankCheckIcons);
    expect(component.rendered);
    expect(component.custRefRegex);
    expect(component.custRefLength);
    expect(component.disabled);
  });
  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    });
  // it('call the ng onint of the component', () => {
  //     spyOn(component, 'setLcMode').and.callThrough();
  //     component.setLcMode(Event);
  //   });
  it('call the ng onint of the component', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    component.onClickNext(Event);
  });
  // it('call the ng onint of the component', () => {
  //   spyOn(component, 'onClickConfirmation').and.callThrough();
  //   component.onClickConfirmation();
  // });
  // it('call the ng onint of the component', () => {
  //   spyOn(component, 'onClickRevolving').and.callThrough();
  //   component.onClickRevolving();
  // });
});
