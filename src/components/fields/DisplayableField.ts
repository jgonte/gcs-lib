import Disableable from "../mixins/disableable/Disableable";
import Sizable from "../mixins/sizable/Sizable";
import Field from "./Field";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { displayableFieldStyles } from "./DisplayableField.styles";

export const inputEvent = "inputEvent";

export default abstract class DisplayableField extends
    Disableable(
        Sizable(
            Field as unknown as CustomHTMLElementConstructor
        )
    ) {

    /** 
     * The initial value of the tracked component 
     * A component is considered "modified" if its current value is different from the initial one
     */
    _initialValue?: unknown = null;

    static get styles(): string {

        return mergeStyles(super.styles, displayableFieldStyles);
    }

    connectedCallback(): void {

        super.connectedCallback?.();

        this._initialValue = this.value;// Set the initial value
    }

    /**
     * Called every time the input changes
     * @param event The event of the element with the change
     */
    handleInput(event: Event): void {

        super.handleInput(event);

        this.dispatchCustomEvent(inputEvent, {
            modified: this._initialValue !== this._tempValue // Notify the parent whether the value has changed or not
        });
    }
}