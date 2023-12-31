/**
 * Tasks Management
 * Create a task for the corporate or bank user
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


/**
 * Counterparty definition
 */
export interface CounterpartyUserDetails {
    /**
     * The full name of the company of the counterparty users for whom the task is assigned
     */
    companyName?: string;
    /**
     * The abbreviated name of the counterparty users company for whom the task is assigned
     */
    companyShortName?: string;
    /**
     * Select whether to send notification on any event occuring on this item to the counterparty
     */
    emailNotificationRequired?: boolean;
    /**
     * The email id of the counterparty company to whom the notification is to be sent
     */
    email?: string;
}
