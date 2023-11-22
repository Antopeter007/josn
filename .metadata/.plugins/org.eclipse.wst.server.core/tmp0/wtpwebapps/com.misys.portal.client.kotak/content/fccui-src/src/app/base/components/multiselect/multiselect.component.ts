import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'fcc-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent implements OnInit {
  @Input()
  params: any;
  selectedoptionsmulti: [];
  selectedItems: any;
  constructor() { }

  ngOnInit() {
  }

  onChange: (value: any) => void = () => null;
  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }
}

