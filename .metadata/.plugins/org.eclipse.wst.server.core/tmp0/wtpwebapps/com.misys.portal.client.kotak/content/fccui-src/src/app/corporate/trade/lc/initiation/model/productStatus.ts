/**
 * Import Letter of Credit
 * Import Letter of Credit (ILC) is an undertaking to pay to a beneficiary (an exporter), issued by a bank on
 * behalf of its corporate customer (an importer; applicant) for procured goods or services. A payment is released
 * to the exporter against a presentation of specified documentation and in accordance with the terms of the letter
 * of credit.  The ILC reflects the transaction request from the perspective of an importer and the importer's bank,
 * typically known as the issuing bank.  'Issuance request' is the initial event that creates the ILC transaction
 * event. This event could only be created once per ILC. If changes to the basic details of the ILC are needed, an
 * 'Amendment request' event could be created. Once the beneficiary submits their documents and claims the payment,
 * a 'Claims Received' event is created. The 'Amend' and 'Claims Received' events can be created multiple times and
 * at any point in the ILC lifecycle prior to its expiry.  Issuance request can be for the final issuance of letter
 *  of credit by the issuing bank or if this request is marked as \"Provisional\", then it is for vetting the text
 *  of the letter of credit by the issuing bank. On finalisation of the text between the corporate customer and the
 * bank, the actual letter of credit will be issued by the bank.  There are two kinds of IDs in this API: id and
 * eventId. The eventId is the identifier returned for events such as 'Issuance', 'Amendment' and 'Claims Received'.
 * The id is the identifier returned for the ILC master and it is created together with the 'Issuance' event. A master
 *  ILC transaction can have one 'Issuance' event and multiple 'Amendment' and 'Claims Received' events.
 *
 * OpenAPI spec version: 1.1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


/**
 * The latest status for the letter of credit transaction. Possible product status code values:
 *  * N005_* = * * N005_01 = Not Processed * N005_02 = Pending * N005_03 = New * N005_04 = Accepted
 * * N005_05 = Settled * N005_06 = Cancelled * N005_07 = Updated * N005_08 = Amended * N005_09 = Extended
 *  * N005_10 = Purged * N005_11 = Released * N005_12 = Discrepant * N005_13 = Partially Settled
 * * N005_14 = Partial Sight Payment * N005_15 = Sight Payment * N005_16 = Notification of Charges
 * * N005_17 = Version * N005_18 = In Progress * N005_19 = Tracer * N005_20 = Consent * N005_21 = Received
 * * N005_22 = Expire * N005_23 = Paid * N005_24  = Request for Settlement * N005_25 = Partially Approved
 * * N005_26 = Advise of Bill Arrival - Clean * N005_27 = IO Registered * N005_28 = Approved by Consent
 * * N005_29 = Release Accepted * N005_30 = Decrease Accepted * N005_31 = Amendment Awaiting Beneficiary Approval
 * * N005_32 = Amendment Refused * N005_33 = Payment Refused * N005_34 = General Request
 * * N005_35 = Recurring Transfer * N005_36 = Last Recurring Completed * N005_37 = Last Recurring Rejected
 * * N005_38 = Post Dated Pending * N005_39 = Recurring Pending * N005_40 = Printed * N005_41 = Failed
 * * N005_42 = Expired * N005_43 = Finalised * N005_44 = Request for Acceptance * N005_45 = Presented
 * * N005_46 = Eligible * N005_47 = Not Eligible * N005_48 = Invoice Accepted * N005_49 = Invoice Rejected
 *  * N005_50 = Early Payment Requested * N005_51 = Returned * N005_52 = Early Payment Ack.
 * * N005_53 = Early Payment Nack. * N005_54 = Financing Requested * N005_55 = Resubmitted
 * * N005_56 = Financing Request Refusal * N005_57 = In Progress * N005_58 = Not Processed
 * * N005_59 = Recurring Rejected * N005_60 = Early Payment Refusal * N005_61 = Initial
 *  * N005_62 = Amendment Refused  * N005_63 = Closed * N005_64 = Complete * N005_65 = Partially Matched
 * * N005_66 = Established * N005_67 = Proposed * N005_68 = Reactivate Requested * N005_69 = Request Payment
 * * N005_70 = Registered * N005_71 = Unregistered * N005_72 = PO Established * N005_73 = LC Registered
 * * N005_74 = Match * N005_75 = Mismatch * N005_76 = Approved * N005_77 = Closed * N005_78 = Wording Under Review
 * * N005_79 = Final Wording * N005_80 = Renewed * N005_81 = Cancel Awaiting Beneficiary Response
 * * N005_82 = Cancel refused * N005_83  = Cancel refused * N005_84 = Claim Presentation
 *  * N005_85 = Claim Settlement * N005_86 = Extend/Pay * N005_87 = Claim Accepted * N005_88 = Claim Rejected
 * * N005_89 = Awaiting Documents * N005_90 = Active * N005_91 = Active/LIinked * N005_92 = Confirm
 * * N005_93 = Filled * N005_94 = Interim Expired * N005_95 = Pending Fill * N005_96 = Approved Payable
 * Financing Requested * N005_97 = Approved Payable Financing Request Refused * N005_98 = Provisional
 * * N005_99 = Other * N005_A6 = Payment Request * N005_AA = Intent To Pay * N005_A0 = Rejected
 * * N005_A3 = Book Off * N005_A8 = Amendment Accepted * N005_B0 = Claim in Progress
 * * N005_B1 = General Claim Request * N005_B2 = Claim Withdrawn * N005_B3 = Invalid Claim Rejected
 * * N005_B4 = Claim Pending * N005_B5 = Advice of Renewal * N005_B6 = Advice of Diarised Amendment
 * * N005_B7 = Periodic Charge Advise * N005_B8 = Claim Closed * N005_B9 = Invoice Pending Acceptance
 * * N005_A1 = Request Approval from Applicant * N005_A2 = Claim Rejection
 * * N005_A4 = General Request to Presenter * N005_A5 = General Request to Applicant
 * * N005_A7 = General Request to Issuer * N005_A9 = Pre Advise of Bill Arrival * N005_C1 = Advice
 * * N005_C2 = Pre Advice * N005_C3 = Advise reduction/increase * N005_C4 = Reduction/increase
 * * N005_C5 = Transfer Advise * N005_C6 = APF Seller Upload Invoice Reject
 * * N005_C7 = APF Seller Upload Finance Request * N005_C8 = APF Seller Upload Finance Refusal
 * * N005_C9 = APF Buyer Upload Finance Request * N005_D0 = APF Buyer Upload Finance Refusal
 * * N005_D1 = Payment mismatch accept * N005_D2 = Payment mismatch reject * N005_D3 = Payment mismatch accept finalized
 *  * N005_D4 = Intent to Pay with Mismatch Acceptance. * N005_D5 = Bulk Partially Approved
 *  * N005_D6 = Bulk Rejected * N005_G1 = Utilization * N005_G2 = Deferred Payment
 * * N005_G3 = Presentation  Possible product status code values for Finance Repayment:
 * * N005_D7 = Finance Repayment Requested * N005_D8 = Finance Repayment Accepted
 * * N005_D9 = Finance Repayment Rejected  Possible product status code values for Collections:
 * * N005_E0 = Invoice Settled * N005_E1 = Invoice Partially Settled * N005_E2 = Invoice Settlement Requested
 * * N005_E0 = Settled * N005_E1 = Partially Settled * N005_E2 = Settlement Requested  Possible product status codes
 *  for Bulk Finance Repayment: * N005_E3 = Bulk Repayment Rejected  Possible product status codes for Credit Note
 *  Processed: * N005_E4 = Credit Note Processed  Possible product status codes for Invoice Settled through Credi
 * t Notes: * N005_E5 = Partially Settled through Credit Notes * N005_E6 = Settled through Credit Notes  Possib
 * le product status codes for Delete:  * N005_E7 = Delete * N005_E8 = Invoice Registered * N005_E9 = Maintenan
 * ce Charge Advise  Possible product status codes for EL notification of transfer: * N005_F1 = Transfer Effecte
 * d * N005_F2 = Transfer Refused * N005_F3 = Failed
 */
export type ProductStatus = string;
