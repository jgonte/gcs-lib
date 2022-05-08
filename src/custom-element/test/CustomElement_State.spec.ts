import CustomElement from "../CustomElement";
import defineCustomElement from "../defineCustomElement";
import CustomElementStateMetadata from "../mixins/metadata/types/CustomElementStateMetadata";
import clearCustomElements from "./helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement state tests", () => {

    it('should set the default state value', () => {

        class A extends CustomElement {

            static get state(): Record<string, CustomElementStateMetadata> {

                return {

                    type: {
                        value: "a" // Options: "a" | "b" | "c"
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
});