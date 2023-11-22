/**
 * Several Transaction approvals
 * API allows a corporate user to approve or reject multiple transactions pending for approval.
 *
 * OpenAPI spec version: TBD
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { SubmitTransaction } from './submitTransaction';

/**
 * Submission request definition with list of transactions for approval
 */
export interface SubmissionRequest {
  /**
   * transaction details array object
   */
  transactions?: SubmitTransaction[];
  /**
   * action taken for transactions by user. Approve/Reject
   */
  action?: string;
  /**
   * comments for approval or returning a transaction
   */
  comments?: string;

  listKeys?: string[];
}