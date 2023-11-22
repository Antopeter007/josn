/**
 * Corporate User Profile
 * The Corporate User Profile API provides the information on the corporate banking customers user's:
 * bank, corporate details, corporate entity, user details and the access level privileges.
 *
 * OpenAPI spec version: 1.0.2
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


/**
 * Allowed Action Definition
 */
export interface CorporateReference {
  /**
   * Short Name of the corporate entity that uniquely identifies an entity
   */
  entityShortName?: string;
  /**
   * Unique Short Name of the bank
   */
  bankShortName?: string;
  /**
   * Unique reference of the corporate/entity
   */
  reference?: string;
  /**
   * Descriptive information on the customer reference
   */
  description?: string;
  /**
   * Unique Short Name of the corporate
   */
  companyShortName?: string;
}