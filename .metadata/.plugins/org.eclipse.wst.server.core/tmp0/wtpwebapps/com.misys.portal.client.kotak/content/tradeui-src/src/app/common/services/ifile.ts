export class FileMap {
  constructor(
      public file: File,
      public fileName: string,
      public title: string,
      public type: string,
      public attachmentId: string,
      public refId: string,
      public tnxId: string,
      public brchCode: string,
      public companyId: string,
      public status: string,
      public uploadDate: string
  ) {}
}
