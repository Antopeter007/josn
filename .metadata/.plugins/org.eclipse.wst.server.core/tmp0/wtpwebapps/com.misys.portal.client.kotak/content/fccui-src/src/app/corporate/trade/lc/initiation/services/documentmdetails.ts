export class DocumentDetailsMap {
  constructor(
      public fileName: string,
      public attachmentId: string,
      public documentType: string,
      public numOfOriginals: string,
      public numOfPhotocopies: string,
      public documentDate: string,
      public documentName: string,
      public total: string,
      public documentNumber: string,
      public required: boolean,
      public maxlenght: number
  ) {}
}
