import { Constants } from './../../constants';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fcc-common-narrative-character-count',
  templateUrl: './narrative-character-count.component.html',
  styleUrls: ['./narrative-character-count.component.scss']
})
export class NarrativeCharacterCountComponent implements OnInit {

  constructor() { }

// tslint:disable-next-line: no-input-rename
  @Input('enteredCharCount') public enteredCharCount: string;
// tslint:disable-next-line: no-input-rename
  @Input('allowedCharCount') public allowedCharCount: string;
  // tslint:disable-next-line:no-input-rename
  @Input('fieldSize') public fieldSize: string;
  fieldWidth: any;

  ngOnInit() {
    this.fieldWidth = this.fieldSize === 'L' ?  Constants.LENGTH_65 : Constants.LENGTH_35;
  }

}
