/**
 * Import Letter of Credit
 * _Import Letter of Credit (ILC) is an undertaking to pay to a beneficiary (an exporter), issued by a bank on behalf of its
 * corporate customer (an importer; applicant) for procured goods or services. A payment is released to the exporter against
 * a presentation of specified documentation and in accordance with the terms of the letter of credit._  _The ILC reflects the
 *  transaction request from the perspective of an importer and the importer's bank, typically known as the issuing bank._
 * _'Issuance request' is the initial event that creates the ILC transaction event. This event could only be created once per
 *  ILC. If changes to the basic details of the ILC are needed, an 'Amendment request' event could be created. Once the
 * beneficiary submits their documents and claims the payment, a 'Claims Received' event is created. The 'Amend' and 'Claims
 *  Received' events can be created multiple times and at any point in the ILC lifecycle prior to its expiry._  _Issuance
 * request can be for the final issuance of letter of credit by the issuing bank or if this request is marked as "Provisional",
 * then it is for vetting the text of the letter of credit by the issuing bank. On finalisation of the text between the
 *  corporate customer and the bank the actual letter of credit will be issued by the bank._  _There are two kinds of IDs
 * in this API: id and eventId. The eventId is the identifier returned for events such as 'Issuance', 'Amendment' and 'Claims
 * Received'. The id is the identifier returned for the ILC master and it is created together with the 'Issuance' event.
 * A master ILC transaction can have one 'Issuance' event and multiple 'Amendment' and 'Claims Received' events._
 *
 * OpenAPI spec version: 1.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AddressTypes } from './addressTypes';
import { FileExtensions } from './fileExtensions';


/**
 * Letter of Credit configuration
 */
export class ConfigurationList {
    /**
     * If Y, this will determine whether a total of 800 * 65 characters would be allowed in narrative fields. If N, the
     * individual limit of 100 * 65 characters would be applicable for each narrative field. The following fields are valid
     * for the swift narratives- goodsDescription, documentsRequired, additionalConditions and specialPaymentConditionsForBeneficiary
     */
    swiftNarrative?: boolean;
    /**
     * The maximum number of file attachments possible
     */
    maxAttachments?: number;
    /**
     * Allowed file extensions
     */
    allowedFileExtensions?: Array<FileExtensions>;
    /**
     * The maximum file size allowed per file for the upload in bytes as configured
     */
    maxfileSize?: number;
    /**
     * The maximum length of customer reference field configured
     */
    customerReferenceLength?: number;
    /**
     * The maximum length of digits after the decimals for amount field as configured
     */
    allowedDecimals?: number;
    /**
     * The maximum length of name field configured
     */
    nameLength?: number;
    /**
     * Max length allowed for line 1 address field as per configuration
     */
    line1AddressLength?: number;
    /**
     * Max length allowed for line 2 address field as per configuration
     */
    line2AddressLength?: number;
    /**
     * Max length allowed for line 3 address field as per configuration
     */
    line3AddressLength?: number;
    /**
     * Max length allowed for line 4 address field as per configuration
     */
    line4AddressLength?: number;
    /**
     * The maximum sum of the size of name and address fields combined allowed
     */
    nameAndAddressMaxLength?: number;
    /**
     * The max length configured for the named place for shipment details
     */
    namedPlaceLength?: number;
    /**
     * The type of address configured. This will provide a list of all addresses configured
     */
    addressType?: Array<AddressTypes>;
}
