export class BaseRequest {

  public constructor() {
  }

  objectData: any = {};

  public mergeObjectData(fieldName, value) {
    this.objectData[fieldName] = value;
  }

}
