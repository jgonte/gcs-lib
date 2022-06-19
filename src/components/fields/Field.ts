import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import SingleValueFieldValidator from "../../utils/validation/validators/field/SingleValueFieldValidator";
import Validator from "../../utils/validation/validators/Validator";
import LocalizedText from "../localized-text/LocalizedText";
import Sizable from "../mixins/sizable/Sizable";
import Validatable from "../mixins/validatable/Validatable";
import { fieldStyles } from "./Field.styles";

export const inputEvent = "inputEvent";

export const changeEvent = "changeEvent";

export const fieldAddedEvent = "fieldAddedEvent";

export default abstract class Field extends
    Sizable(
        Validatable(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {

    // The temporary value being validated on input
    // Since it is not the final one, there is no need to refresh it
    private _tempValue: unknown = undefined;

    // Marker to mark the field as such so it can be filtered out from other components
    isField = true;

    static get styles(): string {

        return mergeStyles(super.styles, fieldStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field
             */
            name: {
                type: ConversionTypes.String,
                required: true
            },

            /**
             * The initial value of the field
             */
            value: {
                type: [
                    ConversionTypes.String,
                    ConversionTypes.Object // Ideally is a string but could be a more complex object
                ],
                reflect: true
            },

            disabled: {
                type: ConversionTypes.Boolean,
                reflect: true
            },

            required: {
                type: ConversionTypes.Boolean,
                inherit: true,
                reflect: true
            }
        };
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

        if (attributeName === 'required') {

            if (newValue !== "false") { // Add a required validator

                if (!this.hasRequiredValidator()) {

                    const {
                        validators = []
                    } = this;

                    this.validators = [...validators, new RequiredValidator()];
                }
            }
            else { // remove any existing required validator

                if (this.hasRequiredValidator()) {

                    const {
                        validators
                    } = this;

                    const requiredValidator = validators.filter((v: SingleValueFieldValidator) => v instanceof RequiredValidator)[0];

                    if (requiredValidator !== undefined) {

                        const index = validators.indexOf(requiredValidator);

                        validators.splice(index, 1);

                        this.validators = validators;
                    }
                }
            }
        }

        super.attributeChangedCallback(attributeName, oldValue, newValue);
    }

    hasRequiredValidator(): boolean {

        return this.validators.filter((v: Validator) => v instanceof RequiredValidator).length > 1;
    }

    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement) {

        super.didAdoptChildCallback?.(parent, child);

        if (child !== this) { // Not a field

            return;
        }

        this.dispatchCustomEvent(fieldAddedEvent, {
            field: child
        });
    }

    handleBlur(/*event: Event*/) {

        //this.validate();
    }

    /**
     * Called every time the input changes
     * Perform validation to give instantaneous feedback but do not update the current value since it might keep changing
     * @param event 
     * @returns 
     */
    handleInput(event: Event) {

        this._tempValue = this.getNewValue(event.target as HTMLInputElement);

        this.validate(); // Validate the field on input

        this.dispatchCustomEvent(inputEvent, {
            modified: !this.dataField.hasSameInitialValue(this._tempValue)
        });
    }

    createValidationContext() /*: ValidationContext */ {

        const label = this.getLabel();

        const value = this._tempValue ?? this.value;

        return {
            label,
            value,
            warnings: [],
            errors: []
        };
    }

    initializeValidator(validator: string) {

        switch (validator) {

            case 'required': return new RequiredValidator();
            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    getLabel(): string {

        const {
            adoptingParent
        } = this;

        const lt = Array.from(adoptingParent.children).filter(c => c instanceof LocalizedText);

        if (lt.length > 0) {

            return (lt[0] as LocalizedText).innerHTML;
        }
        else {

            throw new Error('Not implemented');
        }
    }

    handleChange(event: Event): void {

        // Reset the temporary value
        this._tempValue = undefined;

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        const oldValue = this.value;

        this.value = this.getNewValue(target);

        const {
            name,
            value
        } = this;

        this.dispatchCustomEvent(changeEvent, {
            name,
            oldValue,
            newValue: value
        });
    }

    getNewValue(input: HTMLInputElement): unknown {

        let value: unknown;

        switch (input.type) {
            case 'file':
                {
                    const {
                        files
                    } = input;

                    if (files === null ||
                        files.length === 0) { // No files selected

                        return value;
                    }

                    if (input.multiple === true) {

                        value = Array.from(files).map(f => {

                            return {
                                name: f.name,
                                type: f.type,
                                size: f.size,
                                content: URL.createObjectURL(f)
                            };
                        });
                    }
                    else {

                        const f = files[0];

                        value = {
                            name: f.name,
                            type: f.type,
                            size: f.size,
                            content: URL.createObjectURL(f)
                        };
                    }
                }
                break;
            default:
                {
                    value = input.value;
                }
                break;
        }

        return value;
    }
}