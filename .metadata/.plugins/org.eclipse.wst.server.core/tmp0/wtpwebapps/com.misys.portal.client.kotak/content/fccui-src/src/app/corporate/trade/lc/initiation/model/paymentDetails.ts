/**
 * Import Letter of Credit
 * _Import Letter of Credit (ILC) is an undertaking to pay to a beneficiary (an exporter), issued by a bank on behalf of
 * its corporate customer (an importer; applicant) for procured goods or services. A payment is released to the exporter
 * against a presentation of specified documentation and in accordance with the terms of the letter of credit._
 * _The ILC reflects the transaction request from the perspective of an importer and the importer's bank, typically
 * known as the issuing bank._  _'Issuance request' is the initial event that creates the ILC transaction event. This
 * event could only be created once per ILC. If changes to the basic details of the ILC are needed, an 'Amendment request'
 *  event could be created. Once the beneficiary submits their documents and claims the payment, a 'Claims Received' event
 * is created. The 'Amend' and 'Claims Received' events can be created multiple times and at any point in the ILC lifecycle
 * prior to its expiry._  _Issuance request can be for the final issuance of letter of credit by the issuing bank or if this
 * request is marked as "Provisional", then it is for vetting the text of the letter of credit by the issuing bank. On
 *  finalisation of the text between the corporate customer and the bank the actual letter of credit will be issued by the
 * bank._  _There are two kinds of IDs in this API: id and eventId. The eventId is the identifier returned for events such as
 * 'Issuance', 'Amendment' and 'Claims Received'. The id is the identifier returned for the ILC master and it is created
 * together with the 'Issuance' event. A master ILC transaction can have one 'Issuance' event and multiple 'Amendment' and
 * 'Claims Received' events._
 *
 * OpenAPI spec version: 1.1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { TransactionAddress } from './address';
import { Tenor } from './tenor';


/**
 * Payment details object definition
 */
export class PaymentDetails {
    /**
     * The party where drafts are drawn on. This field should only be used when creditAvailableBy is ACCEPTANCE, SIGHT-PAYMENT,
     *  DEFERRED-PAYMENT OR NEGOTIATION
     */
    creditAvailableWith?: PaymentDetails.CreditAvailableWithEnum;
    /**
     * The name of the bank with which the credit would be available, in case of Other. This will be a mandatory field in case
     * the creditAvailableWith is sent as OTHER
     */
    bankName?: string;
    /**
     * The address of the bank with which the credit would be available
     */
    address?: TransactionAddress;
    /**
     * -> The payment method through which the letter of credit is made available to Beneficiary. Based on the payment terms,
     * the draftAt validations will apply. This field is mandatory for submission of a LC transaction or a template. If the
     * payment term is SIGHT-PAYMENT, the maturity date should not be sent. If the payment term is ACCEPTANCE, either of the
     * maturity date or (period, frequency,fromAfter and start) should be sent. If the payment term is NEGOTIATION, either of
     * the sight, maturity date or (period, frequency,fromAfter and start) needs to be sent. If the payment term is
     * DEFERRED-PAYMENT, either of the maturity date or (period, frequency,fromAfter and start) needs to be sent. If the
     *  payment term is MIXED-PAYMENT, none of the maturity date or (period,frequncy,fromAfter and start) needs to be sent.
     * Only the field mixedPayDetail should be sent.
     */
    creditAvailableBy?: PaymentDetails.CreditAvailableByEnum;
    tenor?: Tenor;
    /**
     * The details of the various payment schedules in case the letter of credit is of Mixed Payment type
     */
    mixedPayDetail?: string;
    /**
     * The drawee details for the bill of exchange in letter of credit. This field should be sent mandatorily only in case of
     * payment terms as Sight-payment, Acceptance and Negotiation. For deferred-payment and mixed-payment, the drawee details
     * should not be sent
     */
    draftsDrawnOn?: PaymentDetails.DraftsDrawnOnEnum;
    /**
     * The name of the bank with which the credit would be available, in case of Other. This will be a mandatory field in case
     * the draftsDrawnOn is sent as OTHER
     */
    draftsDrawnOnBank?: string;
}
export namespace PaymentDetails {
    export type CreditAvailableWithEnum = 'ADVISING-BANK' | 'ISSUING-BANK' | 'ANY-BANK' | 'OTHER';
    export const CreditAvailableWithEnum = {
        ADVISINGBANK: 'ADVISING-BANK' as CreditAvailableWithEnum,
        ISSUINGBANK: 'ISSUING-BANK' as CreditAvailableWithEnum,
        ANYBANK: 'ANY-BANK' as CreditAvailableWithEnum,
        OTHER: 'OTHER' as CreditAvailableWithEnum
    };
    export type CreditAvailableByEnum = 'SIGHT-PAYMENT' | 'ACCEPTANCE' | 'NEGOTIATION' | 'DEFERRED-PAYMENT' | 'MIXED-PAYMENT';
    export const CreditAvailableByEnum = {
        SIGHTPAYMENT: 'SIGHT-PAYMENT' as CreditAvailableByEnum,
        ACCEPTANCE: 'ACCEPTANCE' as CreditAvailableByEnum,
        NEGOTIATION: 'NEGOTIATION' as CreditAvailableByEnum,
        DEFERREDPAYMENT: 'DEFERRED-PAYMENT' as CreditAvailableByEnum,
        MIXEDPAYMENT: 'MIXED-PAYMENT' as CreditAvailableByEnum
    };
    export type DraftsDrawnOnEnum = 'ISSUING-BANK' | 'CONFIRMING-BANK' | 'ADVISING-BANK' | 'NEGOTIATING-BANK' | 'REIMBURSING-BANK' | 'APPLICANT' | 'OTHER';
    export const DraftsDrawnOnEnum = {
        ISSUINGBANK: 'ISSUING-BANK' as DraftsDrawnOnEnum,
        CONFIRMINGBANK: 'CONFIRMING-BANK' as DraftsDrawnOnEnum,
        ADVISINGBANK: 'ADVISING-BANK' as DraftsDrawnOnEnum,
        NEGOTIATINGBANK: 'NEGOTIATING-BANK' as DraftsDrawnOnEnum,
        REIMBURSINGBANK: 'REIMBURSING-BANK' as DraftsDrawnOnEnum,
        APPLICANT: 'APPLICANT' as DraftsDrawnOnEnum,
        OTHER: 'OTHER' as DraftsDrawnOnEnum
    };
}