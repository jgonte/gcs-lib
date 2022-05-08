import CustomElement from "../CustomElement";
import defineCustomElement from "../defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../mixins/metadata/types/CustomElementPropertyMetadata";
import clearCustomElements from "./helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement properties tests", () => {

    it('should set the default property value', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: ConversionTypes.String,
                        value: "a"
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>"';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement ;

        expect(component.type).toBe('a');
    });

    it('should throw an error when the attribute does not correspond to the options', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: ConversionTypes.String,
                        value: "a",
                        options: ["a", "b", "c"]
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a type="d"></test-a>"';
        }
        catch(error) {

            expect((error as Error).message).toBe('Value: d is not part of the options: [a, b, c]');
        }
    });

    it('should throw an error when a property is required but there is not a value provided when the custom element is created', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: ConversionTypes.String,
                        value: "a",
                        required: true
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        try {

            document.body.innerHTML = '<test-a type="a"></test-a>"';
        }
        catch(error) {

            expect((error as Error).message).toBe('Value: d is not part of the options: [a, b, c]');
        }
    });
});
