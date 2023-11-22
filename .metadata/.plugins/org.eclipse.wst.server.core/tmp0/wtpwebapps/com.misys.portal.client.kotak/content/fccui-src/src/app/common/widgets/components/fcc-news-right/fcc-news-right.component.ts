import { FCCBase } from './../../../../base/model/fcc-base';
import { AbstractControl } from '@angular/forms';
import { TextControl, ImgControl, HrControl } from './../../../../base/model/form-controls.model';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { OPEN_CLOSE_ANIMATION } from '../../../model/animation';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'fcc-news-right',
  templateUrl: './fcc-news-right.component.html',
  styleUrls: ['./fcc-news-right.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: FccNewsRightComponent }],
  animations: [OPEN_CLOSE_ANIMATION]
})
export class FccNewsRightComponent extends FCCBase implements OnChanges, OnInit {

  @Input() currentListOfNews;
  @Input() newsType;
  form: FCCFormGroup;
  @Output() newsTitleName = new EventEmitter<string>();
  label: string;
  module = '';
  constructor(protected translateService: TranslateService) {
    super();
  }




  ngOnInit() {

    this.intializeForm();

  }

  ngOnChanges() {
    this.intializeForm();
  }

  intializeForm() {

    this.form = new FCCFormGroup({});

    if (this.newsType === 'internal') {
      this.label = `${this.translateService.instant('MoreInternalNews')}`;
    } else {
      this.label = `${this.translateService.instant('MoreExternalNews')}`;
    }

    this.form = new FCCFormGroup({
      title: new TextControl('lcheader', this.translateService, {
        label: this.label,
        key: 'lcheader',
        rendered: true,
        layoutClass: 'p-col-12',
        styleClass: ['title newsheader']
      })
    });

    this.currentListOfNews.forEach(element => {

      if (element.index === true) {
        this.form.addControl(element.itemId + 'image', this.getImageControl(element));
        this.form.addControl(element.itemId + 'desc', this.getDescControl(element));
        this.form.addControl(element.itemId + 'hr', this.getHrControl());
      }
    });
    this.form.setFormMode('edit');


  }


  getImageControl(element: any) {
    const control: AbstractControl = new ImgControl('lcheader', this.translateService, {
      label: element.image,
      key: 'lcheader',
      rendered: true,
      layoutClass: 'p-col-5',
      styleClass: ['newsimage']
    });
    return control;
  }


  getDescControl(element: any) {
    const control: AbstractControl = new TextControl('newsheader', this.translateService, {
      itemId: element.itemId,
      titleLabel: element.title,
      label: element.desc,
      key: 'lcheader',
      rendered: true,
      layoutClass: 'p-col-7 ',
      styleClass: ['desc']
    });
    return control;
  }


  getHrControl() {
    const control: AbstractControl = new HrControl('lcheader', this.translateService, {
      label: '',
      key: 'lcheader',
      rendered: true,
      layoutClass: 'p-col-12',
      styleClass: ['image']
    });
    return control;
  }

  onClickNewsheader(titleName, id) {
    if ( id !== undefined) {
      this.newsTitleName.emit(id);
    }
  }


}
