import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { FCCFormControl } from '../../../../../app/base/model/fcc-control.model';

export function checkNonZeroTenorValue(control: FCCFormControl) {
 if (control && control.value !== null && control.value !== undefined) {
  const tenorValue = parseInt(control.value, 10);
  if (tenorValue === FccGlobalConstant.LENGTH_0) {
        return {
        nonZeroTenorValue: true
      };
    }
  return null;
  }
}
