import { UntypedFormGroup, Form } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'fcc-iu-initiate-local-undertaking',
  templateUrl: './local-undertaking.component.html',
  styleUrls: ['./local-undertaking.component.css']
})
export class LocalUndertakingComponent implements OnInit {


  public jsonContent;
  @Output() addFormTo = new EventEmitter<any>();
  formEvent: Subject<Form> = new Subject();

  constructor() {}

  ngOnInit(): void {
  }

  addToForm(name: string, form: UntypedFormGroup) {
    this.addFormTo.emit(form);
   }

}
