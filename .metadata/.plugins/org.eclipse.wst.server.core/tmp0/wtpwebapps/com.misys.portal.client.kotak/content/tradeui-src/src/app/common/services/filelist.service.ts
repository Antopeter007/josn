import { Injectable } from '@angular/core';
import { FileMap } from './ifile';

@Injectable({
  providedIn: 'root'
})
export class FilelistService {

  public arr: File[] = [];
  public fileMap: FileMap[] = [];
  constructor() { }

  pushFiles(file: File, fileName: string, title: string, type: string, attachmentId: string,
            refId: string, tnxId: string, brchCode: string, companyId: string,
            status: string, uploadDate: string) {
    this.fileMap.push(new FileMap(file, fileName, title, type, attachmentId, refId, tnxId, brchCode, companyId, status, uploadDate));
  }

  pushFile(fileMap: FileMap) {
    this.fileMap.push(fileMap);
  }

  getlist() {
    return this.fileMap;
   }

  get numberOfFiles(): number {
    return this.fileMap.length;
  }

}
