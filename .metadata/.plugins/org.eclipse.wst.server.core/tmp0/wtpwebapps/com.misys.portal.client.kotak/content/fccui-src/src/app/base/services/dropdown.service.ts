import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  dropdownoptions: any[] = [];


  constructor() { }

  getDropdownlist(): Observable<any[]> {
    // make your call here
    this.dropdownoptions = [
        {label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}},
        {label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}},
        {label: 'London', value: {id: 3, name: 'London', code: 'LDN'}},
        {label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}},
        {label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}},
        {label: 'New York', value: {id: 6, name: 'New York', code: 'NY'}},
        {label: 'Rome', value: {id: 7, name: 'Rome', code: 'RM'}},
        {label: 'London', value: {id: 8, name: 'London', code: 'LDN'}},
        {label: 'Istanbul', value: {id: 9, name: 'Istanbul', code: 'IST'}},
        {label: 'Paris', value: {id: 10, name: 'Paris', code: 'PRS'}}
      ];
    return of(this.dropdownoptions);


}

getlist(): Observable<any[]> {
  // make your call here
  this.dropdownoptions = [
      {label: 'Mumbai', value: {id: 1, name: 'New York', code: 'NY'}},
      {label: 'Kolkata', value: {id: 2, name: 'Rome', code: 'RM'}},
      {label: 'Chennai', value: {id: 3, name: 'London', code: 'LDN'}},
      {label: 'Bangalore', value: {id: 4, name: 'Istanbul', code: 'IST'}},
      {label: 'Hyderabad', value: {id: 5, name: 'Paris', code: 'PRS'}},
      {label: 'Delhi', value: {id: 6, name: 'New York', code: 'NY'}},
      {label: 'Shimla', value: {id: 7, name: 'Rome', code: 'RM'}},
      {label: 'Kashmir', value: {id: 8, name: 'London', code: 'LDN'}},
      {label: 'Jaipur', value: {id: 9, name: 'Istanbul', code: 'IST'}},
      {label: 'Puri', value: {id: 10, name: 'Paris', code: 'PRS'}}
    ];
  return of(this.dropdownoptions);
  }

}
