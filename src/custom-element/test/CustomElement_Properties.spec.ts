import CustomElement from "../CustomElement";
import defineCustomElement from "../defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../mixins/metadata/types/CustomHTMLElementConstructor";
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
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe('a');
    });

    it('should set the property value to a function', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    type: {
                        type: ConversionTypes.Function,
                        value: () => 5
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        // Attach it to the DOM
        document.body.innerHTML = '<test-a></test-a>';

        // Test the element
        const component = document.querySelector('test-a') as CustomElement;

        expect(component.type).toBe(5);
    });

    it('should set the property values of the derived class', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    baseProp: {
                        attribute: "base-prop",
                        type: ConversionTypes.Number,
                        value: 13
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        class B extends A {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    derivedProp: {
                        attribute: "derived-prop",
                        type: ConversionTypes.Number,
                        value: 26
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-b', B);

        // Attach it to the DOM
        document.body.innerHTML = "<test-b></test-b>";

        // Test the element
        const component = document.querySelector('test-b') as CustomElement;

        expect(component.baseProp).toBe(13);

        expect(component.derivedProp).toBe(26);
    });

    it('should set the property values of the mixed-in class', () => {

        class A extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    baseProp: {
                        attribute: "base-prop",
                        type: ConversionTypes.Number,
                        value: 13
                    }
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        function Mixin<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

                return class AMixin extends Base {

                    static get properties(): Record<string, CustomElementPropertyMetadata> {

                        return {

                            derivedProp: {
                                attribute: "derived-prop",
                                type: ConversionTypes.Number,
                                value: 26
                            }
                        };
                    }
                }
            }

            class B extends Mixin(A) {
            }

            defineCustomElement('test-b', B);

            // Attach it to the DOM
            document.body.innerHTML = "<test-b></test-b>";

            // Test the element
            const component = document.querySelector('test-b') as CustomElement;

            expect(component.baseProp).toBe(13);

            expect(component.derivedProp).toBe(26);
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
        catch (error) {

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

            document.body.innerHTML = '<test-a type="a"></test-a>';
        }
        catch (error) {

            expect((error as Error).message).toBe('Value: d is not part of the options: [a, b, c]');
        }
    });
});
