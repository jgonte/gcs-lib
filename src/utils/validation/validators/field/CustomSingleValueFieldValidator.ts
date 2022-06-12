import { ValidatorOptions } from "../Validator";
import SingleValueFieldValidator, { SingleValueFieldValidationContext } from "./SingleValueFieldValidator";

export interface CustomFieldValidatorOptions extends ValidatorOptions {

    validateFcn: (value: string | number) => boolean;
}

export default class CustomSingleValueFieldValidator extends SingleValueFieldValidator {

    validateFcn: (value: string | number) => boolean;

    constructor(options: CustomFieldValidatorOptions) {

        super(options);

        this.validateFcn = options.validateFcn;
    }

    validate(context: SingleValueFieldValidationContext): boolean {

        const {
            label,
            value
        } = context;

        const valid = this.validateFcn.call(this, value as string | number);

        if (!valid) {

            this.emitErrors(context, { label });
        }

        return valid;
    }
}