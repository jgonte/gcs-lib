import appCtrl from "../../../../services/appCtrl";
import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

const defaultMessage = "This field is required";

export interface RequiredValidatorOptions extends ValidatorOptions {

    /** If true, allows '' as a valid value */
    allowEmpty?: boolean;
}

export default class RequiredValidator extends SingleValueFieldValidator {

    /** If true, allows '' as a valid value */
    allowEmpty: boolean;

    constructor(options: RequiredValidatorOptions = {}) {

        if (options.message === undefined) {

            const intlProvider = appCtrl.intlProvider;

            if (intlProvider !== undefined) {

                options.message = intlProvider.getTranslation(intlProvider.lang, '{{label}} is required') || defaultMessage;          
            }
            else {

                options.message = defaultMessage;
            }      
        }

        super(options);

        this.allowEmpty = options.allowEmpty || false;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        let valid: boolean;

        valid = !(value === undefined || value === null);

        if (valid === true && this.allowEmpty === false) {

            valid = value !== '';
        }

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}