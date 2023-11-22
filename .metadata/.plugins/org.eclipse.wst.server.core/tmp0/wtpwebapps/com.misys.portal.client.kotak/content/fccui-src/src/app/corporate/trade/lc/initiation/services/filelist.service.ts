import { Injectable } from '@angular/core';
import { FileMap } from './mfile';
import { UserData } from '../../../../../common/model/user-data';
import { HttpClient } from '@angular/common/http';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { BankFileMap } from './bankmfile';
import { DocumentDetailsMap } from './documentmdetails';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { ELMT700FileMap } from './elMT700mfile';


@Injectable({
  providedIn: 'root'
})
export class FilelistService {

  public arr: File[] = [];
  public fileMap: FileMap[] = [];
  public bankFileMap: BankFileMap[] = [];
  public elMT700FileMap: ELMT700FileMap[] = [];
  public documentDetailsMap: DocumentDetailsMap[] = [];
  userData: UserData;
  fileUploadRequest: any;
  public docsUpdated = true;
  private fileIdMap: Map<string, FileMap> = new Map();
  private bankFileIdMap: Map<string, BankFileMap> = new Map();
  private elMT700FileIdMap: Map<string, ELMT700FileMap> = new Map();
  public clearMasterDocs = true;
  constructor(protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService) { }

  pushFiles(file: File, fileName: string, title: string, type: string, typePath: string, fileSize: string, atachID: string, docId: string,
            id: string, eventId: string, uploadDate: string, mimeType?: string) {
    this.fileMap.push(new FileMap(file, fileName, title, type, typePath, fileSize, atachID, docId, id, eventId, uploadDate, mimeType));
  }

  pushBankFiles(file: File, fileName: string, title: string, type: string, typePath: string, fileSize: string, atachID: string,
                docId: string, id: string, eventId: string, uploadDate: string, mimeType?: string) {
    this.bankFileMap.push(new BankFileMap(file, fileName, title, type, typePath, fileSize, atachID, docId, id,
      eventId, uploadDate, mimeType));
  }

  pushELMT700Files(file: File, fileName: string, title: string, type: string, typePath: string, fileSize: string, atachID: string,
                   docId: string, id: string, eventId: string, uploadDate: string) {
    this.elMT700FileMap.push(new ELMT700FileMap(file, fileName, title, type, typePath, fileSize, atachID, docId, id, eventId, uploadDate));
  }

  pushFile(fileMap: FileMap) {
    let exist = false;
    for (let i = 0; i < this.fileMap.length; i++) {
    if (this.fileMap[i].attachmentId === fileMap.attachmentId)
    {
      exist = true;
      break;
    }
  }
    if (!exist) {
   this.fileMap.push(fileMap);
  }
}

  pushBankFile(bankFileMap: BankFileMap) {
    this.bankFileMap.push(bankFileMap);
  }

  pushELMT700File(elMT700FileMap: ELMT700FileMap) {
    this.elMT700FileMap.push(elMT700FileMap);
  }

  getList() {
    return this.fileMap;
  }

  getDocumentList() {
    return this.documentDetailsMap;
  }

  getBankList() {
    return this.bankFileMap;
  }

  getELMT700List() {
    return this.elMT700FileMap;
  }

  get numberOfFiles(): number {
    return this.fileMap.length;
  }

  get elMT700numberOfFiles(): number {
    return this.elMT700FileMap.length;
  }

  get numberOfDocuments(): number {
    return this.documentDetailsMap.length;
  }

  resetList() {
    const len = this.fileMap.length;
    this.fileMap.splice(0, len);
    if (this.fileIdMap !== null && this.fileIdMap !== undefined) {
      this.fileIdMap.clear();
    }
  }

  resetELMT700List() {
    const len = this.elMT700FileMap.length;
    this.elMT700FileMap.splice(0, len);
    if (this.elMT700FileIdMap !== null && this.elMT700FileIdMap !== undefined) {
      this.elMT700FileIdMap.clear();
    }
  }

  resetBankList() {
    if (this.bankFileMap && this.bankFileMap.length > 0) {
      const len = this.bankFileMap.length;
      this.bankFileMap.splice(0, len);
    }
    if (this.bankFileIdMap && this.bankFileIdMap !== null) {
      this.bankFileIdMap.clear();
    }
  }

  emptyBankList() {
    if (this.bankFileMap && this.bankFileMap.length > 0) {
      const len = this.bankFileMap.length;
      this.bankFileMap.splice(0, len);
    }
    if (this.bankFileIdMap && this.bankFileIdMap !== null) {
      this.bankFileIdMap.clear();
      this.bankFileIdMap = null;
    }
    if (this.fileIdMap && this.fileIdMap !== null) {
      this.fileIdMap.clear();
      this.fileIdMap = null;
    }
  }

  addFileIdToMap(file: FileMap) {
    if (this.fileIdMap === null) {
      this.fileIdMap = new Map<string, FileMap>();
    }
    this.fileIdMap.set(file.attachmentId, file);
  }

  addBankFileIdToMap(file: FileMap) {
    if (this.bankFileIdMap === null) {
      this.bankFileIdMap = new Map<string, FileMap>();
    }
    this.bankFileIdMap.set(file.attachmentId, file);
  }

  addELMT700FileIdToMap(file: FileMap) {
    this.elMT700FileIdMap.set(file.attachmentId, file);
  }

  getFileById(attachmentId: string) {
    return this.fileIdMap.get(attachmentId);
  }

  getBankFileById(attachmentId: string) {
    return this.bankFileIdMap.get(attachmentId);
  }

  getELMT700FileById(attachmentId: string) {
    return this.elMT700FileIdMap.get(attachmentId);
  }

  getFileList() {
    const fileList = [];
    this.fileIdMap.forEach(element => {
      fileList.push(element);
    });
    return fileList;
  }

  getBankFileList() {
    const bankFileList = [];
    this.bankFileIdMap.forEach(element => {
      bankFileList.push(element);
    });
    return bankFileList;
  }

  getELMT700FileList() {
    const elMT700FileList = [];
    this.elMT700FileIdMap.forEach(element => {
      elMT700FileList.push(element);
    });
    return elMT700FileList;
  }

  pushDocumentDetailsMap(documentDetailMap: DocumentDetailsMap) {
    this.documentDetailsMap.push(documentDetailMap);
  }

  resetDocumentList() {
    const len = this.documentDetailsMap.length;
    this.documentDetailsMap.splice(0, len);
    if (this.fileIdMap !== null && this.fileIdMap !== undefined) {
      this.fileIdMap.clear();
    }
  }

  /**
   * This method is used to add the validations on for attachment section
   * @fileList list of files attached
   * @form   Atatchment Form Group
   * @productCode Product Code
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAttachmentValidations(fileList, form: FCCFormGroup, productCode) {
    // for adding validation while customization
  }


}

