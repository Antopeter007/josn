/**
 * Import Letter of Credit
 * _Import Letter of Credit (ILC) is an undertaking to pay to a beneficiary (an exporter), issued by a bank on behal
 * f of its corporate customer (an importer; applicant) for procured goods or services. A payment is released to the e
 * xporter against a presentation of specified documentation and in accordance with the terms of the letter of credit
 * ._  _The ILC reflects the transaction request from the perspective of an importer and the importer's bank, typical
 * ly known as the issuing bank._  _'Issuance request' is the initial event that creates the ILC transaction event. Th
 * is event could only be created once per ILC. If changes to the basic details of the ILC are needed, an 'Amendment r
 * equest' event could be created. Once the beneficiary submits their documents and claims the payment, a 'Claims Rece
 * ived' event is created. The 'Amend' and 'Claims Received' events can be created multiple times and at any point in
 * the ILC lifecycle prior to its expiry._  _Issuance request can be for the final issuance of letter of credit by the
 * issuing bank or if this request is marked as "Provisional", then it is for vetting the text of the letter of credit
 * by the issuing bank. On finalisation of the text between the corporate customer and the bank the actual letter of cr
 * edit will be issued by the bank._  _There are two kinds of IDs in this API: id and eventId. The eventId is the identif
 * ier returned for events such as 'Issuance', 'Amendment' and 'Claims Received'. The id is the identifier returned for
 * the ILC master and it is created together with the 'Issuance' event. A master ILC transaction can have one 'Issuance
 * ' event and multiple 'Amendment' and 'Claims Received' events._
 *
 * OpenAPI spec version: 1.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { BankCharges } from './bankCharges';
import { GeneralDetailsMaster } from './generalDetailsMaster';
import { ImportLetterOfCreditCommon } from './importLetterOfCreditCommon';


/**
 * Import Letter of Credit Details of a master transaction
 */
export class ImportLetterofCreditMaster extends ImportLetterOfCreditCommon {
  generalDetails?: GeneralDetailsMaster;
    bankCharges?: BankCharges;
}