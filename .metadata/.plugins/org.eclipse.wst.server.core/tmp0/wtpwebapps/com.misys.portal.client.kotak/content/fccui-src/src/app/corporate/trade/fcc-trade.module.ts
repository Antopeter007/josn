import { FccSrModule } from './sr/fcc-sr.module';
import { FccLiModule } from './li/fcc-li.module';
import { FccFTTradeModule } from './ftTrade/initiation/component/fcc-ft-trade.module';
import { FccSgModule } from './sg/fcc-sg.module';
import { FccECModule } from './ec/fcc-ec.module';
import { FccIcModule } from './ic/fcc-ic.module';
import { FccElModule } from './el/fcc-el.module';
import { FccTradeRoutes } from './fcc-trade.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FccLcModule } from './lc/fcc-lc.module';
import { FccTfModule } from './tf/fcc-tf.module';
import { FccIrModule } from './ir/fcc-ir.module';
import { FccUiModule } from './ui/fcc-ui.module';
import { FccSiModule } from './si/fcc-si.module';
import { FccUaModule } from './ua/fcc-ua.module';
import { FormResolverModule } from './../../shared/FCCform/form/form-resolver/form-resolver.module';
import { FccSeModule } from '../common-services/se/email/fcc-se.module';
import { FccSeUploadModule } from '../common-services/se/upload/fcc-se-upload.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FccTradeRoutes,
    FccLcModule,
    FccElModule,
    FccIcModule,
    FccSgModule,
    FccSeModule,
    FccECModule,
    FccTfModule,
    FccIrModule,
    FccFTTradeModule,
    FccUiModule,
    FccSiModule,
    FccLiModule,
    FccSrModule,
    FccUaModule,
    FccSeUploadModule,
    FormResolverModule,
  ]
})
export class FccTradeModule { }
