import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchLayoutService {

  searchLayoutDataSubject = new BehaviorSubject(null);

  constructor(protected dialogService: DialogService) {}

  initializeSearchLayoutDataSubject() {
    if (this.searchLayoutDataSubject.observers) {
      this.searchLayoutDataSubject.observers.length = 1;
    }
  }
}
