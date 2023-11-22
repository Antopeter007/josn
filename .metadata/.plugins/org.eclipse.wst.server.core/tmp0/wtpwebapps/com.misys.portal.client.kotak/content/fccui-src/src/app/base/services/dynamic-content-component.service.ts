import { Injectable } from '@angular/core';
import { Mapping } from '../model/mapping';

@Injectable({
  providedIn: 'root'
})
export class DynamicContentComponentService {
  UnknownDynamicComponent = 'UnknownDynamicComponent';

  constructor() { }
  getComponentType(typeName: string) {
    const type = Mapping.mappings[typeName];
    return type || this.UnknownDynamicComponent;
}
}

