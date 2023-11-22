import { Component, OnInit, Input } from '@angular/core';

@ Component({
  selector: 'fcc-common-narrative-character-count',
  templateUrl: './narrative-character-count.component.html',
  styleUrls: ['./narrative-character-count.component.scss']
})
export class NarrativeCharacterCountComponent implements OnInit {

  constructor() {
    //eslint : no-empty-function
  }

// eslint-disable-next-line @angular-eslint/no-input-rename
  @ Input('enteredCharCount') public enteredCharCount: number;
// eslint-disable-next-line @angular-eslint/no-input-rename
  @ Input('allowedCharCount') public allowedCharCount: string;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @ Input('fieldSize') public fieldSize: any;
  fieldWidth: any;

  ngOnInit() {
    this .fieldWidth = this .fieldSize;
  }
}
