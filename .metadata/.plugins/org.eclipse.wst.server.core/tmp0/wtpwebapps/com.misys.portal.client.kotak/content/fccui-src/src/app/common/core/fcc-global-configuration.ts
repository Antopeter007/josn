import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FccGlobalConfiguration {
  /*configured properties*/
  public static configurationValues = new Map();

  /*this method will check which keys are available in cache and returns not found keys*/
  configurationValuesCheck(configuredKeys: string): any {
    const keys: string[] = configuredKeys.split(',');
    const keysNotFound: string[] = [];
    keys.forEach(element => {
      if (!FccGlobalConfiguration.configurationValues.has(element)) {
        keysNotFound.push(element);
      }
    });
    return keysNotFound;
  }

  /*this method will add values into the cache*/
  addConfigurationValues(result, keysNotFound: string[]) {
    const response = JSON.parse(JSON.stringify(result));
    keysNotFound.forEach(element => {
      FccGlobalConfiguration.configurationValues.set(element, response[element]);
    });
  }
}
