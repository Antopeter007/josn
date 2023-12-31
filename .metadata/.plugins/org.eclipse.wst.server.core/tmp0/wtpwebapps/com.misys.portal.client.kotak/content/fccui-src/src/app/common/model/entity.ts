import { Address } from './address';
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
 * Entity List Definition
 */
export interface Entity {
    /**
     * Name of the entity
     */
    name?: string;
    /**
     * Short Name of the corporate entity that uniquely identifies an entity.
     */
    shortName?: string;
    /**
     * Alternative Address fields of the corporate entity
     */
    alternativeAddress?: Address;
}
