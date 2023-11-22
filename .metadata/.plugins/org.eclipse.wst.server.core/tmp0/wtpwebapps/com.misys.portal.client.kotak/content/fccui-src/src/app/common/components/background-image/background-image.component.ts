import { Component, OnInit } from '@angular/core';
import { FCCBase } from '../../../base/model/fcc-base';
import { CommonService } from '../../services/common.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { ImageFormControl } from '../../../base/model/form-controls.model';
import { TranslateService } from '@ngx-translate/core';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'fcc-common-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BackgroundImageComponent }]

})
export class BackgroundImageComponent extends FCCBase implements OnInit {
  form: FCCFormGroup;
  module = '';
  contextPath: any;

  constructor(protected commonService: CommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected translateService: TranslateService) {
    super();
  }

  ngOnInit() {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.initializeFormGroup();
        this.patchFieldParameters(this.form.get('backGroundImage'), { path: this.contextPath + response.loginImageFilePath });
      }
    });
  }

  initializeFormGroup() {
    this.form = new FCCFormGroup({
      backGroundImage: new ImageFormControl('backGroundImage', this.translateService, {
        layoutClass: 'firstTimeLoginImageLayout',
        styleClass: 'firstTimeLoginImage',
        anchorNeeded: false,
        rendered: true
      })
    });
  }

}
