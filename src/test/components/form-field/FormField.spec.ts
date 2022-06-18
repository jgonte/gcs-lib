import TextField from "../../../components/fields/text/TextField";
import FormField from "../../../components/form/form-field/FormField";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    it('should render a form field', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        defineCustomElement('wcl-form-field', FormField);

        // Attach it to the DOM
        document.body.innerHTML = `<wcl-form-field>
            <span slot="label">Name</span>
            <wcl-text-field slot="field" name="name"></wcl-text-field>
        </wcl-form-field>`;

        // Test the element
        const component = document.querySelector('wcl-form-field') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* FormField.css */\n#field-row {\n    background-color: darkgoldenrod;\n}</style><wcl-row id=\"field-row\" justify-content=\"start\">    \n            <wcl-form-label required=\"false\" modified=\"false\" justify-content=\"space-evenly\" style=\"width: undefined;\">\n                    <span slot=\"label\">\n                        <slot name=\"label\"></slot>\n                    </span>\n                    <wcl-row slot=\"tools\" justify-content=\"space-evenly\">\n                        <slot name=\"tools\"></slot>\n                    </wcl-row>\n            </wcl-form-label>           \n            <span>:</span>\n            <slot name=\"field\"></slot>      \n        </wcl-row>\n        <wcl-validation-summary warnings=\"[]\" errors=\"[]\">\n        </wcl-validation-summary>");
    });
});