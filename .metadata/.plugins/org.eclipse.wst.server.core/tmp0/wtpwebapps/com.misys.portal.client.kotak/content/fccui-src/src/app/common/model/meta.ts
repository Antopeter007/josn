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
 * list of additional information
 */
export interface Meta {
    /**
     * number of items per page
     */
    limit?: string;
    /**
     * total number of pages
     */
    pageCount?: string;
    /**
     * total number of items
     */
    itemCount?: string;
}