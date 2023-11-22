/**
 * @description
 * productvalidator is implemented by all product services(eg: lc-product.service.ts) to perform
 * product specific business validations
 *
 * define `beforeSaveValidation()` and `beforeSubmitValidation()` to handle any validations tasks for specific product form.
 * default validations are implemented in its respective product services.
 *
 * @usageNotes
 * to handle any additional business validations, extend respective productservice class and override required validation method.
 *
 * @example
 * for an LC beforeSaveValidation(), extend lc-product.service.ts and override beforeSaveValidation() in extended service class.
 *
 * @publicApi
 */
export interface ProductValidator {
    /**
     * validations to perform before save
     */
    beforeSaveValidation(form?): boolean;
    /**
     * validations to perform before submit.
     * invokes `validate()` method
     * @see validate
     */
    beforeSubmitValidation(): boolean;
    /**
     * performs business validation validations.
     * invoked from beforeSubmitValidation().
     */
    validate() ;

}
