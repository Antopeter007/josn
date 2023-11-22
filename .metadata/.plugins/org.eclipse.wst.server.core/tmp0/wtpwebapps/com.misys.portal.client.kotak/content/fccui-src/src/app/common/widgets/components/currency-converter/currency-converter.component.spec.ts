import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ CurrencyConverterComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('variable declaration', () => {
    expect(component.currency);
    expect(component.ccRequest);
    expect(component.curRequest);
    expect(component.selectedCurrency);
    expect(component.calculatedAmount);
    expect(component.fromCurrency);
    expect(component.toCurrency);
    expect(component.fromAmount);
    expect(component.defaultFlag);
    expect(component.imagePath);
    expect(component.fromAmountString);
    expect(component.toAmountString);
    expect(component.toAmountValue);
    expect(component.hideShowCard);
    expect(component.checkCustomise);
    expect(component.classCheck);
    expect(component.eighteen);
    expect(component.ten);
    expect(component.thirtyOne);
    expect(component.fortyThree);
    expect(component.fiftySeven);
    expect(component.dir);
    expect(component.dirFlagStyle);
    expect(component.dirTextStyle);
    expect(component.iso);
    expect(component.OMR);
    expect(component.BHD);
    expect(component.TND);
    expect(component.JPY);
    expect(component.flagDecimalPlaces);
    expect(component.toAmtDecimalPlaces);
    expect(component.length4);
    expect(component.fromAmtSize);
    expect(component.length11);
    expect(component.length12);
    expect(component.length14);
    expect(component.length15);
    expect(component.length17);
    expect(component.length18);
    expect(component.configuredKeysList);
    expect(component.keysNotFoundList);
    expect(component.toCurrencies);
    expect(component.toCurrencyList);
  });

  it('call the ng onint of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
  });

  it('call the ng toggleCurrency of the component', () => {
    spyOn(component, 'toggleCurrency').and.callThrough();
    component.toggleCurrency();
  });

  it('call the ng calculateFromCurrency of the component', () => {
    spyOn(component, 'calculateFromCurrency').and.callThrough();
    component.calculateFromCurrency();
  });

  it('call the ng calculateToCurrency of the component', () => {
    spyOn(component, 'calculateToCurrency').and.callThrough();
    component.calculateToCurrency();
  });

  it('call the ng calculateAmount of the component', () => {
    spyOn(component, 'calculateAmount').and.callThrough();
    component.calculateAmount();
  });

  it('call the ng calculateFromAmount of the component', () => {
    spyOn(component, 'calculateFromAmount').and.callThrough();
    component.calculateFromAmount();
  });

  it('call the ng calculateToAmount of the component', () => {
    spyOn(component, 'calculateToAmount').and.callThrough();
    component.calculateToAmount();
  });

  it('call the ng addFromAmtDelimiters of the component', () => {
    spyOn(component, 'addFromAmtDelimiters').and.callThrough();
    component.addFromAmtDelimiters();
  });

  it('call the ng addToAmtDelimiters of the component', () => {
    spyOn(component, 'addToAmtDelimiters').and.callThrough();
    component.addToAmtDelimiters();
  });

  it('call the ng onBlurFromAmt of the component', () => {
    spyOn(component, 'onBlurFromAmt').and.callThrough();
    component.onBlurFromAmt();
  });

  it('call the ng removeDelimiters of the component', () => {
    spyOn(component, 'removeDelimiters').and.callThrough();
    component.removeDelimiters();
  });

  it('call the ng isNumber of the component', () => {
    spyOn(component, 'isNumber').and.callThrough();
    component.isNumber(Event);
  });

  it('call the ng fromAmtMaxlength of the component', () => {
    spyOn(component, 'fromAmtMaxlength').and.callThrough();
    component.fromAmtMaxlength();
  });

});
