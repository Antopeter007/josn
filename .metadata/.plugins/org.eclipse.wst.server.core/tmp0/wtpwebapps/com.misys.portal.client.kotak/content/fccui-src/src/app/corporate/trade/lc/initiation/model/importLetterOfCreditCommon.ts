/**
 * Import Letter of Credit
 * _Import Letter of Credit (ILC) is an undertaking to pay to a beneficiary (an exporter), issued by a bank on behalf of
 * its corporate customer (an importer; applicant) for procured goods or services. A payment is released to the exporter
 * against a presentation of specified documentation and in accordance with the terms of the letter of credit._  _The IL
 * C reflects the transaction request from the perspective of an importer and the importer's bank, typically known as the
 *  issuing bank._  _'Issuance request' is the initial event that creates the ILC transaction event. This event could on
 * ly be created once per ILC. If changes to the basic details of the ILC are needed, an 'Amendment request' event could
 * be created. Once the beneficiary submits their documents and claims the payment, a 'Claims Received' event is created.
 *  The 'Amend' and 'Claims Received' events can be created multiple times and at any point in the ILC lifecycle prior
 *  to its expiry._  _Issuance request can be for the final issuance of letter of credit by the issuing bank or if thi
 * s request is marked as "Provisional", then it is for vetting the text of the letter of credit by the issuing bank.
 *  On finalisation of the text between the corporate customer and the bank the actual letter of credit will be issued by
 * the bank._  _There are two kinds of IDs in this API: id and eventId. The eventId is the identifier returned for events
 *  such as 'Issuance', 'Amendment' and 'Claims Received'. The id is the identifier returned for the ILC master and it
 * is created together with the 'Issuance' event. A master ILC transaction can have one 'Issuance' event and multiple 'A
 * mendment' and 'Claims Received' events._
 *
 * OpenAPI spec version: 1.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AlternateApplicantDetails } from './alternateApplicantDetails';
import { Amount } from './amount';
import { Applicant } from './applicant';
import { Attachments } from './attachments';
import { Bank } from './bank';
import { BankInstructions } from './bankInstructions';
import { Beneficiary } from './beneficiary';
import { Charge } from './charge';
import { Confirmation } from './confirmation';
import { IssuingBank } from './issuingBank';
import { LcDetails } from './lcDetails';
import { LcTypes } from './lcTypes';
import { LicenseDetails } from './licenseDetails';
import { Narrative } from './narrative';
import { PaymentDetails } from './paymentDetails';
import { Revolving } from './revolving';
import { Shipment } from './shipment';
import { Tolerance } from './tolerance';


/**
 * Fields common to Import Letter of Credit Issuance   and Template details
 */
export class ImportLetterOfCreditCommon {
  lcDetails?: LcDetails;
  lcType?: LcTypes;
  applicant?: Applicant;
  alternateApplicant?: AlternateApplicantDetails;
  beneficiary: Beneficiary;
  amount: Amount;
  amountTolerance?: Tolerance;
  confirmation?: Confirmation;
  chargeDetail: Charge;
  revolving?: Revolving;
  paymentDetails: PaymentDetails;
  shipment?: Shipment;
  issuingBank?: IssuingBank;
  advisingBank?: Bank;
  adviseThroughBank?: Bank;
  license?: LicenseDetails;
  narrative?: Narrative;
  bankInstructions?: BankInstructions;
  attachments?: Attachments;
}
