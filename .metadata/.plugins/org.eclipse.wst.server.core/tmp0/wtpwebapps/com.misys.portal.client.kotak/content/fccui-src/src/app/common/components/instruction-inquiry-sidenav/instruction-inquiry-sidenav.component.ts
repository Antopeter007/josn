import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs/internal/Subscription';
import { HOST_COMPONENT } from './../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FCCBase } from '../../../base/model/fcc-base';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ProductParams } from '../../model/params-model';
import { CommonService } from '../../services/common.service';
import { DropDownAPIService } from '../../services/dropdownAPI.service';
import { FormModelService } from '../../services/form-model.service';
import { MultiBankService } from '../../services/multi-bank.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';

@Component({
  selector: 'app-instruction-inquiry-sidenav',
  templateUrl: './instruction-inquiry-sidenav.component.html',
  styleUrls: ['./instruction-inquiry-sidenav.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: InstructionInquirySidenavComponent }]
})
export class InstructionInquirySidenavComponent extends FCCBase implements OnInit {
  module = '';
  subscription: Subscription;
  entityRowData: any;
  dir: string = localStorage.getItem('langDir');
  form: FCCFormGroup;
  responseObj: any;
  entities = [];
  flag = false;
  subSectionModels: any;
  subProductCode: string;
  productCode: string;
  refId: any;
  currentEntity: any;
  toastPosition: string;
  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected transactionDetailService: TransactionDetailService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected messageService: MessageService
    ) {
      super();
    }

    ngOnInit() {
      this.toastPosition = this.dir === 'rtl' ? 'top-left' : 'top-right';
      this.subscription = this.commonService.listenInstInquiryClicked$.subscribe(
        () => {
           this.flag = true;
           this.initializeFormGroup();
      });
    }

    initializeFormGroup() {
      const entityModel = 'setInstructionNavModel';
      const params: ProductParams = {
        type: FccGlobalConstant.MODEL_SUBSECTION
      };
      this.commonService.getProductModel(params).subscribe(
        response => {
          const dialogmodel = JSON.parse(JSON.stringify(response[entityModel]));
          this.form = this.formControlService.getFormControls(dialogmodel);
          this.patchFieldParameters(this.form.get('facilityValue'), { label: '' });
        });
    }

}
