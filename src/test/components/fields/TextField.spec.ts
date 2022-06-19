import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import TextField from "../../../components/fields/text/TextField";
import CustomElement from "../../../custom-element/CustomElement";

beforeEach(() => {

    clearCustomElements();
});

describe("Text field tests", () => {

    it('should throw an error when the required attributes are not provided', () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<wcl-text-field></wcl-text-field>`;

        }).toThrow(new Error("The attributes: [name] must have a value"));
    });

    it('should not render the value when it is not provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<wcl-text-field id="tf1" name="name"></wcl-text-field>';

        // Test the element
        const component = document.querySelector('wcl-text-field') as CustomElement ;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* SizableMixin */\n/* host applies to the text component */\n:host([size='large']) *{\n    /* padding: var(--wcl-padding-size-large); */\n    font-size: var(--wcl-font-size-large);\n    min-height: var(--wcl-min-height-large);\n}\n\n:host([size='medium']) *{\n    /* padding: var(--wcl-padding-size-medium); */\n    font-size: var(--wcl-font-size-medium);\n    min-height: var(--wcl-min-height-medium);\n}\n\n:host([size='small']) *{\n    /* padding: var(--wcl-padding-size-small);  */\n    font-size: var(--wcl-font-size-small);\n    min-height: var(--wcl-min-height-small);\n}\n\n\n:host {\n    margin-left: 1rem;\n}\n\ninput, \nselect,\ntextarea {\n    flex: 1 0 0px;\n    outline: none;\n    border-style: solid;\n    border-color: #d0d0d0;\n}\n\ntextarea,\nselect {\n    min-width: 200px;\n    font-family: inherit;\n}\n\ninput[type='date'] {\n    font-family: inherit;\n}\n\ninput:focus,\ntextarea:focus,\nselect:focus {\n    border-style: solid;\n    border-color: #d0d0d0;\n}</style><input type=\"text\" name=\"name\"/>");

        component.value = "Sarah";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* SizableMixin */\n/* host applies to the text component */\n:host([size='large']) *{\n    /* padding: var(--wcl-padding-size-large); */\n    font-size: var(--wcl-font-size-large);\n    min-height: var(--wcl-min-height-large);\n}\n\n:host([size='medium']) *{\n    /* padding: var(--wcl-padding-size-medium); */\n    font-size: var(--wcl-font-size-medium);\n    min-height: var(--wcl-min-height-medium);\n}\n\n:host([size='small']) *{\n    /* padding: var(--wcl-padding-size-small);  */\n    font-size: var(--wcl-font-size-small);\n    min-height: var(--wcl-min-height-small);\n}\n\n\n:host {\n    margin-left: 1rem;\n}\n\ninput, \nselect,\ntextarea {\n    flex: 1 0 0px;\n    outline: none;\n    border-style: solid;\n    border-color: #d0d0d0;\n}\n\ntextarea,\nselect {\n    min-width: 200px;\n    font-family: inherit;\n}\n\ninput[type='date'] {\n    font-family: inherit;\n}\n\ninput:focus,\ntextarea:focus,\nselect:focus {\n    border-style: solid;\n    border-color: #d0d0d0;\n}</style><input type=\"text\" name=\"name\" value=\"Sarah\"/>");

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* SizableMixin */\n/* host applies to the text component */\n:host([size='large']) *{\n    /* padding: var(--wcl-padding-size-large); */\n    font-size: var(--wcl-font-size-large);\n    min-height: var(--wcl-min-height-large);\n}\n\n:host([size='medium']) *{\n    /* padding: var(--wcl-padding-size-medium); */\n    font-size: var(--wcl-font-size-medium);\n    min-height: var(--wcl-min-height-medium);\n}\n\n:host([size='small']) *{\n    /* padding: var(--wcl-padding-size-small);  */\n    font-size: var(--wcl-font-size-small);\n    min-height: var(--wcl-min-height-small);\n}\n\n\n:host {\n    margin-left: 1rem;\n}\n\ninput, \nselect,\ntextarea {\n    flex: 1 0 0px;\n    outline: none;\n    border-style: solid;\n    border-color: #d0d0d0;\n}\n\ntextarea,\nselect {\n    min-width: 200px;\n    font-family: inherit;\n}\n\ninput[type='date'] {\n    font-family: inherit;\n}\n\ninput:focus,\ntextarea:focus,\nselect:focus {\n    border-style: solid;\n    border-color: #d0d0d0;\n}</style><input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });

    it('should render the value when it is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<wcl-text-field id="tf1" name="name" value="Sarah"></wcl-text-field>';

        // Test the element
        const component = document.querySelector('wcl-text-field') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* SizableMixin */\n/* host applies to the text component */\n:host([size='large']) *{\n    /* padding: var(--wcl-padding-size-large); */\n    font-size: var(--wcl-font-size-large);\n    min-height: var(--wcl-min-height-large);\n}\n\n:host([size='medium']) *{\n    /* padding: var(--wcl-padding-size-medium); */\n    font-size: var(--wcl-font-size-medium);\n    min-height: var(--wcl-min-height-medium);\n}\n\n:host([size='small']) *{\n    /* padding: var(--wcl-padding-size-small);  */\n    font-size: var(--wcl-font-size-small);\n    min-height: var(--wcl-min-height-small);\n}\n\n\n:host {\n    margin-left: 1rem;\n}\n\ninput, \nselect,\ntextarea {\n    flex: 1 0 0px;\n    outline: none;\n    border-style: solid;\n    border-color: #d0d0d0;\n}\n\ntextarea,\nselect {\n    min-width: 200px;\n    font-family: inherit;\n}\n\ninput[type='date'] {\n    font-family: inherit;\n}\n\ninput:focus,\ntextarea:focus,\nselect:focus {\n    border-style: solid;\n    border-color: #d0d0d0;\n}</style><input type=\"text\" name=\"name\" value=\"Sarah\"/>");

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* SizableMixin */\n/* host applies to the text component */\n:host([size='large']) *{\n    /* padding: var(--wcl-padding-size-large); */\n    font-size: var(--wcl-font-size-large);\n    min-height: var(--wcl-min-height-large);\n}\n\n:host([size='medium']) *{\n    /* padding: var(--wcl-padding-size-medium); */\n    font-size: var(--wcl-font-size-medium);\n    min-height: var(--wcl-min-height-medium);\n}\n\n:host([size='small']) *{\n    /* padding: var(--wcl-padding-size-small);  */\n    font-size: var(--wcl-font-size-small);\n    min-height: var(--wcl-min-height-small);\n}\n\n\n:host {\n    margin-left: 1rem;\n}\n\ninput, \nselect,\ntextarea {\n    flex: 1 0 0px;\n    outline: none;\n    border-style: solid;\n    border-color: #d0d0d0;\n}\n\ntextarea,\nselect {\n    min-width: 200px;\n    font-family: inherit;\n}\n\ninput[type='date'] {\n    font-family: inherit;\n}\n\ninput:focus,\ntextarea:focus,\nselect:focus {\n    border-style: solid;\n    border-color: #d0d0d0;\n}</style><input type=\"text\" name=\"name\" value=\"Mark\"/>");
    });
});