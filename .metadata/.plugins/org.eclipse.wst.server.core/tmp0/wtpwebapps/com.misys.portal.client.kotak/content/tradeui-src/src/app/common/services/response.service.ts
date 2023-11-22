import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  response: string;
  refId: string;
  tnxId: string;
  tnxType: string;
  option: string;
  subTnxType: string;
  templateId: string;
  productCode: string;

  constructor() { }

  setResponseMessage(message: string) {
    this.response = message;
  }

  getResponseMessage() {
    return this.response;
  }

  setRefId(refId: string) {
    this.refId = refId;
  }

  getRefId() {
    return this.refId;
  }

  setTnxId(tnxId: string) {
    this.tnxId = tnxId;
  }

  getTnxId() {
    return this.tnxId;
  }

  setTnxType(tnxType: string) {
    this.tnxType = tnxType;
  }

  getTnxType() {
    return this.tnxType;
  }

  setOption(option: string) {
    this.option = option;
  }

  getOption() {
    return this.option;
  }

  setSubTnxType(subTnxType: string) {
    this.subTnxType = subTnxType;
  }

  getSubTnxType() {
    return this.subTnxType;
  }

  setTemplateId(templateId: string) {
    this.templateId = templateId;
  }

  getTemplateId(): string {
    return this.templateId;
  }

  setProductCode(productCode: string) {
    this.productCode = productCode;
  }

  getProductCode(): string {
    return this.productCode;
  }

  setResponse(data: any) {
    this.setResponseMessage(data.message);
    this.setRefId(data.refId);
    this.setTnxId(data.tnxId);
    this.setTnxType(data.tnxTypeCode);
    this.setOption(data.option);
   }
}
