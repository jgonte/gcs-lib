import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { DataTypes } from "../../utils/data/DataTypes";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import SingleValueFieldValidator, { FieldValidationContext } from "../../utils/validation/validators/field/SingleValueFieldValidator";
import Validator from "../../utils/validation/validators/Validator";
import LocalizedText from "../localized-text/LocalizedText";
import Validatable from "../mixins/validatable/Validatable";

export const changeEvent = "changeEvent";

export const fieldAddedEvent = "fieldAddedEvent";

function getNewValue(input: HTMLInputElement): unknown {

    switch (input.type) {
        case 'checkbox': return input.checked;
        case 'date': return new Date(input.value);
        case 'file':
            {
                const {
                    files
                } = input;

                if (files === null ||
                    files.length === 0) { // No files selected

                    return null;
                }

                if (input.multiple === true) {

                    return Array.from(files).map(f => {

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

                    return {
                        name: f.name,
                        type: f.type,
                        size: f.size,
                        content: URL.createObjectURL(f)
                    };
                }
            }
        default: return input.value;
    }
}

export default abstract class Field extends
    Validatable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    /**
     * The type of the data of the field
     */
    static dataFieldType: DataTypes = DataTypes.String;

    // The temporary value being validated on input
    // Since it is not the final one, there is no need to refresh it
    private _tempValue: unknown = undefined;

    // Marker to mark the field as such so it can be filtered out from other components
    isField = true; // TODO: Make it static?

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field
             */
            name: {
                type: DataTypes.String,
                required: true
            },

            /**
             * The current value of the field
             */
            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Object // Ideally is a string but could be a more complex object
                ],
                beforeSet: function (value): unknown {

                    if ((this as unknown as Field).beforeValueSet !== undefined) {

                        return (this as unknown as Field).beforeValueSet(value);
                    }

                    return value;
                },
                afterChange: function (value: unknown, oldValue: unknown): void {

                    (this as unknown as Field).onValueChanged?.(value, oldValue);
                },
                reflect: true
            },

            /**
             * Whether the field is required
             */
            required: {
                type: DataTypes.Boolean,
                inherit: true,
                reflect: true
            }
        };
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

        super.attributeChangedCallback?.(attributeName, oldValue, newValue);

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
     * @param event The event of the element with the change
     */
    handleInput(event: Event): void {

        let v = getNewValue(event.target as HTMLInputElement);

        if (this.beforeValueSet !== undefined) {

            v = this.beforeValueSet(v);
        }

        this._tempValue = v;

        this.validate(); // Validate the field on input
    }

    createValidationContext(): FieldValidationContext & { value: unknown; } {

        const label = this.getLabel();

        const value = this._tempValue ?? this.value;

        return {
            label,
            value,
            warnings: [],
            errors: []
        };
    }

    initializeValidator(validator: string): Validator {

        switch (validator) {

            case 'required': return new RequiredValidator();
            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    /**
     * The cached label
     */
    private _label?: HTMLElement;

    getLabel(): string {

        if (this._label === undefined) {

            const {
                adoptingParent
            } = this;

            const lt = Array.from(adoptingParent.children)
                .filter(c => (c as HTMLElement).getAttribute('slot') === 'label');

            switch (lt.length) {
                case 0:
                    {
                        // Do nothing
                    }
                    break;
                case 1:
                    {
                        this._label = lt[0] as HTMLElement;
                    }
                    break;
                default: throw new Error('Only one element can have the attribute of slot=label in the Field');
            }
        }

        const cachedLabel = this._label;

        if (cachedLabel === undefined) {

            return "This field";
        }

        return cachedLabel instanceof LocalizedText ?
            (cachedLabel as LocalizedText).value :
            cachedLabel.innerHTML;
    }

    handleChange(): void {

        // Get the old value
        const oldValue = this.value;

        // Set the new value with the temporary one
        this.value = this._tempValue;

        // Reset the temporary value
        this._tempValue = undefined;

        this.dispatchCustomEvent(changeEvent, {
            name: this.name,
            oldValue,
            newValue: this.value
        });
    }

    acceptChanges(): void {

        this._initialValue = this.value;
    }
}