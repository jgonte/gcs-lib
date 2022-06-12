
import Validator, { ValidationContext } from "../Validator";

export interface FieldValidationContext extends ValidationContext {

    /** The label of the field */
    label: string;
}

export interface SingleValueFieldValidationContext extends FieldValidationContext {

    /** The value to validate */
    value?: string | number
}

export default abstract class SingleValueFieldValidator extends Validator {}