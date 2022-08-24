import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../../utils/data/DataTypes";
import Validator, { ValidationContext } from "../../../utils/validation/validators/Validator";

export const validationEvent = 'validationEvent';

export default function Validatable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ValidatableMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                validators: {
                    type: DataTypes.Array,
                    value: [],
                    beforeSet: function (value): unknown {

                        return (this as unknown as ValidatableMixin).initializeValidators(value as (Validator | string)[]);
                    }
                }
            };
        }

        /**
         * Validates a validatable object
         * @returns true is the value is valid, false otherwise
         */
        async validate(): Promise<boolean> {

            if (this.validators.length === 0) {

                return true; // Nothing to validate
            }

            // Create a new validation context
            const context: ValidationContext = await this.createValidationContext();

            // Validate
            this.validators.forEach((validator: Validator) => validator.validate(context));

            const {
                warnings,
                errors
            } = context;

            // Dispatch the event even if there are no errors to trigger a repaint and rempve previous errors
            this.dispatchCustomEvent(validationEvent, {
                warnings,
                errors
            });

            return errors.length === 0;
        }

        initializeValidators(validators: (Validator | string)[]): Validator[] {

            for (let i = 0; i < validators.length; ++i) {

                const validator = validators[i];

                if (typeof validator === 'string') {

                    validators[i] = this.initializeValidator(validator);
                }
            }

            return validators as Validator[];
        }
    }
}
