import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommonUtilsService {

  toTitleCase(value) {
    return value.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

 }
