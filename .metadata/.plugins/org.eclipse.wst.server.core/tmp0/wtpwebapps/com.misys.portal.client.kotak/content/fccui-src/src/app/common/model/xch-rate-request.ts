import { UserData } from './user-data';
export class ExchangeRateRequest {
  userData: UserData;
  fromCurrency: string;
  toCurrency: string;
}
