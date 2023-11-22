import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsToBankComponent } from './instructions-to-bank.component';

describe('IntructionsToBankComponent', () => {
  let component: InstructionsToBankComponent;
  let fixture: ComponentFixture<InstructionsToBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ InstructionsToBankComponent ],
  //     schemas: [NO_ERRORS_SCHEMA],
  //     imports: [ ReactiveFormsModule, CalendarModule, RadioButtonModule, DragDropModule, DropdownModule,
  //           InputSwitchModule, MultiSelectModule, SelectButtonModule, ProgressBarModule, MessagesModule, MessageModule,
  //           InputTextareaModule, HttpClientTestingModule, RouterModule, RouterTestingModule, TranslateModule.forRoot({
  //                       loader: {
  //                         provide: TranslateLoader,
  //                         useClass: TranslateFakeLoader
  //                       }
  //                     })],
  //     providers: [DialogService, TranslateService ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('variable declaration' , () => {
    expect(component.form);
    expect(component.module);
    expect(component.subheader);
    // expect(component.progressivebar);
    expect(component.lcConstant);
    expect(component.accounts);
  });

  it('call the ng onClickPrevious of the component', () => {
    spyOn(component, 'onClickPrevious').and.callThrough();
    component.onClickPrevious(Event);
  });

  it('call the ng onClickNext of the component', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    component.onClickNext(Event);
  });
});
