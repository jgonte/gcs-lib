import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/test/helpers/clearCustomElements";
import appCtrl from "../../services/appCtrl";
import Icon from "../icon/Icon";



beforeEach(() => {

    clearCustomElements();
});

describe("Icon tests", () => {

    it('should throw an error when the name is not provided', () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('wcl-icon', Icon);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<wcl-icon></wcl-icon>`;

        }).toThrow(new Error("The attributes: [name] must have a value"));
    });

    it('should render an icon', async () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('wcl-icon', Icon);

        // Needs to pass the path to the app controller
        appCtrl.iconsPath = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/icons/";

        // Attach it to the DOM
        document.body.innerHTML = '<wcl-icon name="alarm"></wcl-icon>';

        // Test the element
        const component = document.querySelector('wcl-icon') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<style>/* KindMixin */\n/* host applies to the text component*/\n:host([kind='primary']),\n*[kind='primary'] {\n    color: var(--wcl-color-on-primary);\n}\n\n:host([kind='secondary']),\n*[kind='secondary'] {\n    color: var(--wcl-color-on-secondary);\n}\n\n:host([kind='tertiary']),\n*[kind='tertiary'] {\n    color: var(--wcl-color-on-tertiary);\n}\n\n:host([kind='info']),\n*[kind='info'] {\n    color: var(--wcl-color-on-info);\n}\n\n:host([kind='success']),\n*[kind='success'] {\n    color: var(--wcl-color-on-success);\n}\n\n:host([kind='warning']),\n*[kind='warning'] {\n    color: var(--wcl-color-on-warning);\n}\n\n:host([kind='danger']),\n*[kind='danger'] {\n    color: var(--wcl-color-on-danger);\n}\n\n:host([kind='light']),\n*[kind='light'] {\n    color: var(--wcl-color-on-light);\n}\n\n:host([kind='medium']),\n*[kind='medium'] {\n    color: var(--wcl-color-on-medium);\n}\n\n:host([kind='dark']),\n*[kind='dark'] {\n    color: var(--wcl-color-on-dark);\n}\n\n\n:host svg {\n    display: inline-block;\n    width: 1em;\n    height: 1em;\n    color: inherit;\n}\n\n:host([size='large']) {\n    font-size: var(--wcl-icon-size-large);\n}\n\n:host([size='medium']) {\n    font-size: var(--wcl-icon-size-medium);\n}\n\n:host([size='small']) {\n    font-size: var(--wcl-icon-size-small);\n}</style><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-alarm\" viewBox=\"0 0 16 16\">\n  <path d=\"M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z\"/>\n  <path d=\"M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z\"/>\n</svg>");
    });

    it('should throw an error when the file has an embedded script', async () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('wcl-icon', Icon);

        // Needs to pass the path to the app controller
        appCtrl.iconsPath = 'http://127.0.0.1:5500/src/components/test/';

        try {

            // Attach it to the DOM
            document.body.innerHTML = '<wcl-icon name="script"></wcl-icon>';

            // Test the element
            const component = document.querySelector('wcl-icon') as CustomElement;

            await component.updateComplete; // Wait for the component to render
        }
        catch(error) {

            expect(error).toEqual(new Error("Potencial XSS threat in file: http://127.0.0.1:5500/src/components/test/script.svg"));
        }       
    });

    it('should throw an error when the file has an embedded script in image', async () => {

        // Re-register the components since all the custom elements are cleared before any test
        defineCustomElement('wcl-icon', Icon);

        // Needs to pass the path to the app controller
        appCtrl.iconsPath = 'http://127.0.0.1:5500/src/components/test/';

        try {

            // Attach it to the DOM
            document.body.innerHTML = '<wcl-icon name="image"></wcl-icon>';

            // Test the element
            const component = document.querySelector('wcl-icon') as CustomElement;

            await component.updateComplete; // Wait for the component to render
        }
        catch(error) {

            expect(error).toEqual(new Error("Potencial XSS threat in file: http://127.0.0.1:5500/src/components/test/image.svg"));
        }       
    });
});