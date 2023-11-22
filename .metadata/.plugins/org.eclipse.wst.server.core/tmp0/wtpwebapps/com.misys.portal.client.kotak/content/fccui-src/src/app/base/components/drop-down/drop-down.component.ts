import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';

@Component({
  selector: 'fcc-dropdown',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {

  selectedLanguage: Observable<string>;
  selectedOption: any;
  checkFilter: boolean;
  viewOptions: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Input() params: any[];

  constructor() {
  }

  ngOnInit() {
    const paramLength = 5;
    if (this.params.length > paramLength) {
              this.checkFilter = true;
            } else {
              this.checkFilter = false;
            }
    this.viewOptions = FccGlobalConstant.LENGTH_2;
  }

  // @HostListener('onChange', ['$event'])
  Change(event) {
    this.onChange.emit({
      originalEvent: event.originalEvent,
      value: event.value.name
  });
}

onInputFocus(event) {

}

onInputBlur(event) {

}


}
