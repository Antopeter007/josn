/**
 * input for @see MasterViewDetailComponent
 */
export interface MasterViewDetailParams {
  productCode: string;
  refId: string;
  tnxId?: string;
  mode?: string;
  enableHeader: boolean;
  accordionViewRequired: boolean;
  option?: string;
  parent?: boolean;
  viewMaster?: boolean;
  subTnxTypeCode?: string;
}

/**
 * params referring to current state loaded in product component
 * update as and when needed.
 */
export interface CurrentProductParams {
  refId: string;
  tnxId: string;
  productCode: string;
}

export interface ProductParams {
  type: string;
  productCode?: string;
  subProductCode?: string;
  tnxTypeCode?: string;
  subTnxTypeCode?: string;
  option?: string;
  operation?: string;
  mode?: string;
  category?: string;
}

export interface ProductFormHeaderParams {
  type?: string;
  productCode?: string;
  subProductCode?: string;
  tnxTypeCode?: string;
  subTnxTypeCode?: string;
  option?: string;
  operation?: string;
  mode?: string;
  refId?: string;
  tnxId?: string;
  productFormHeaderContext?; // to handle any undefined context
  hyperlinks?;
  productsList?;
  tabsListPresent?;
  productFormChanged?;
  innerProductFormChanged?;
  showDescriptionHeader?;
}


