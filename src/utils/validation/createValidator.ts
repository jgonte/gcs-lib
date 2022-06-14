import { ValidatorConfig } from "./validators/ValidatorConfig";
import Validator from "./validators/Validator";
import RequiredValidator from "./validators/field/RequiredValidator";

export default function createValidator(cfg: ValidatorConfig): Validator {

    const {
        type
    } = cfg;

    switch (type) {
        case 'required': return new RequiredValidator();
        default: throw Error(`Invalid validator type: ${type}`);
    }
}