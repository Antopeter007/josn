import { MaxlengthCurrenciesPipe } from './maxlength-currencies.pipe';

describe('MaxlengthCurrenciesPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxlengthCurrenciesPipe();
    expect(pipe).toBeTruthy();
  });
});
