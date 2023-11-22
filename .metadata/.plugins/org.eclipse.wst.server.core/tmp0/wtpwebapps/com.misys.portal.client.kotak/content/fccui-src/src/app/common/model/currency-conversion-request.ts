import { UserData } from './user-data';
export class CurrencyConversionRequest {
  userData: UserData;
  fromCurrency: string;
  toCurrency: string;
  fromCurrencyAmount: string;
}
