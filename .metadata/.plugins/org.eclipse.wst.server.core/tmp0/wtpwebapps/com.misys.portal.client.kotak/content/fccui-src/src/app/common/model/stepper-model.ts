export interface StepperParams {
  productCode?: string;
  mode?: string;
  txnType?: string;
  options?: string;
  items?: any; // sections
  isEditable?: boolean; // allows user to return and edit step even if completed
  isLinear?: boolean;
  reEvaluate?: boolean; // set true if progress and state required to calculate again, Open draft/copy from scenarios
}

/**
 * type for add/remove conditional sections from stepper
 */
export interface DynamicSection {
  /** sectionKey as defined in formmodel */
  sectionName: string;
  /**
   * index - optional, position at which section to be added.
   * default - as defined in formmodel
   */
  index?: number;
}
