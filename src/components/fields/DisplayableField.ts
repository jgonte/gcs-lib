import mergeStyles from "../../custom-element/styles/mergeStyles";
import Field from "./Field";
import { displayableFieldStyles } from "./DisplayableField.styles";
import Disableable from "../mixins/disableable/Disableable";
import Sizable from "../mixins/sizable/Sizable";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";

export default abstract class DisplayableField extends
    Disableable(
        Sizable(
            Field as unknown as CustomHTMLElementConstructor
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, displayableFieldStyles);
    }

}