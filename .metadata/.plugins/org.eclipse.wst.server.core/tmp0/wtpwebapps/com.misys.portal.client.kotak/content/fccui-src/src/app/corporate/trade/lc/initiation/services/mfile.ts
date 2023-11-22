export class FileMap {
    constructor(
        public file: File,
        public fileName: string,
        public title: string,
        public type: string,
        public typePath: string,
        public fileSize: string,
        public attachmentId: string,
        public docId: string,
        public id: string,
        public eventId: string,
        public uploadDate: string,
        public mimeType?: string
    ) {}
}
