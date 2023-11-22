import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  private counterUndertakingEnabled: boolean;

  public getCounterUndertakingEnabled(): boolean {
    return this.counterUndertakingEnabled;
  }

  public setCounterUndertakingEnabled(value) {
    this.counterUndertakingEnabled = value;
  }


}
