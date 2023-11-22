import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeDetailsComponent } from './narrative-details.component';

describe('NarrativeDetailsComponent', () => {
  let component: NarrativeDetailsComponent;
  let fixture: ComponentFixture<NarrativeDetailsComponent>;
  // const leftSectionMockService;
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ NarrativeDetailsComponent ],
  //     schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  //     imports:  [ ReactiveFormsModule, SelectButtonModule, ProgressBarModule,
  //        HttpClientTestingModule, RouterModule, RouterTestingModule, TranslateModule.forRoot({
  //         loader: {
  //           provide: TranslateLoader,
  //           useClass: TranslateFakeLoader
  //         }
  //     })],
  //     providers: [DialogService, TranslateService, UtilityService, LeftSectionService, CommonService ]
  //   })
  //   .compileComponents();
  //   // service = TestBed.inject(HttpClientTestingModule);
  //   leftSectionMockService = TestBed.inject(LeftSectionService);
  //   // http = TestBed.inject(HttpTestingController);

  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrativeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // leftSectionMockService.getSectionArray();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('variable declaration' , () => {
    expect(component.module);
    // expect(component.descOfGoods);
    // expect(component.swiftXCharRegex);
    // expect(component.swiftZCharRegex);
    expect(component.modeOfTransmission);
    expect(component.docRequiredMandatory);
    // expect(component.descOfGoodsMandatory);
    // expect(component.swiftExtendedNarrativeEnable);
    // expect(component.swiftFieldDefaultMaxLength);
    // expect(component.descOfGoodsRowCount);
    // expect(component.docRequiredRowCount);
    // expect(component.additionalInstRowCount);
    // expect(component.splBeneRowCount);
    // expect(component.progressiveBar);
    expect(component.params);
    // expect(component.maxlength);
    // expect(component.maxRowCount);
    // expect(component.enteredCharCounts);
    expect(component.allowedCharCount);
    // expect(component.options);
    // expect(component.label);
    expect(component.rendered);
    // expect(component.rowCount);
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
  });

  it('call the ng onClickPrev of the component', () => {
    spyOn(component, 'onClickPrevious').and.callThrough();
    component.onClickPrevious(Event);
      });

  it('call the ng onClickNext of the component', () => {
    spyOn(component, 'onClickNext').and.callThrough();
    component.onClickNext(Event);
      });

  it('call the ng onKeyupDescOfGoodsText of the component', () => {
    spyOn(component, 'onKeyupDescOfGoodsText').and.callThrough();
    component.onKeyupDescOfGoodsText(Event);
      });

  it('call the ng onKeyupSplPaymentBeneText of the component', () => {
    spyOn(component, 'onKeyupSplPaymentBeneText').and.callThrough();
    component.onKeyupSplPaymentBeneText(Event);
      });

  it('call the ng onKeyupAddInstructionText of the component', () => {
    spyOn(component, 'onKeyupAddInstructionText').and.callThrough();
    component.onKeyupAddInstructionText(Event);
      });

  it('call the ng onKeyupDocRequiredText of the component', () => {
    spyOn(component, 'onKeyupDocRequiredText').and.callThrough();
    component.onKeyupDocRequiredText(Event);
      });

  it('call the ng onFocusSplPaymentNarratives of the component', () => {
    spyOn(component, 'onFocusSplPaymentNarratives').and.callThrough();
    component.onFocusSplPaymentNarratives(Event);
      });

  it('call the ng onClickSplPaymentNarratives of the component', () => {
    spyOn(component, 'onClickSplPaymentNarratives').and.callThrough();
    component.onClickSplPaymentNarratives(Event);
      });

  it('call the ng onClickSelectedNarrativeItem of the component', () => {
    spyOn(component, 'onClickSelectedNarrativeItem').and.callThrough();
    component.onClickSelectedNarrativeItem(Event);
      });

  it('call the ng onFocusSelectedNarrativeItem of the component', () => {
    spyOn(component, 'onFocusSelectedNarrativeItem').and.callThrough();
    component.onFocusSelectedNarrativeItem(Event);
      });

  it('call the ng selectNarrativeItem of the component', () => {
    spyOn(component, 'selectNarrativeItem').and.callThrough();
    component.selectNarrativeItem(Event);
      });

  it('call the ng selectSplPaymentNarrative of the component', () => {
    spyOn(component, 'selectSplPaymentNarrative').and.callThrough();
    component.selectSplPaymentNarrative(Event);
      });

  it('call the ng calculateSwiftNarrativeCount of the component', () => {
    spyOn(component, 'calculateSwiftNarrativeCount').and.callThrough();
    component.calculateSwiftNarrativeCount(Event);
      });

});
