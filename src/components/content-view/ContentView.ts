import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementComponentMetadata from "../../custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import { DataTypes } from "../../utils/data/DataTypes";
import { resourceLoader } from "../../utils/resourceLoader";

function createScriptNode(oldScript: Element, newValue: string) {

    const newScript = document.createElement("script");

    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute((attr as any).name, (attr as any).value));

    newScript.setAttribute('data-view', newValue); // Set the view attribute so we can remove it when other views are selected

    newScript.appendChild(document.createTextNode(oldScript.innerHTML));

    return newScript;
}

/**
 * A view that renders dynamic content
 */
export default class ContentView extends CustomElement {

    static get component(): CustomElementComponentMetadata {

        return {

            shadow: false // Do not create a shadow DOM for this component since the scripts are placed in the parent document
        }
       
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

        /**
         * The source to set the content from
         */
            source: {
                type: DataTypes.String,
                afterChange: async function (value: unknown): Promise<void> {

                    const content = await resourceLoader.get(value as string);

                    const parser = new DOMParser();
        
                    // Even though it is a fragment, it creates a full HTML document
                    const {
                        head,
                        body
                    } = parser.parseFromString(content, "text/html");

                    const {
                        document: d
                    } = this as unknown as CustomElement;
        
                    // Clear any previous content
                    while (d.firstChild) {
        
                        //notifyNodeWillDisconnect(d.firstChild);
                        
                        d.firstChild.remove();
                    }
        
                    // Remove any scripts with the data-view attributes set
                    document.head.querySelectorAll('[data-view]').forEach(script => script.remove());
        
                    document.body.querySelectorAll('[data-view]').forEach(script => script.remove());
        
                    // Add any script that appears in the head
                    Array.from(head.children).forEach(child => {
        
                        if (child.tagName === 'SCRIPT') {
        
                            const newScript = createScriptNode(child, value as string);
        
                            document.head.appendChild(newScript);
                        }
                        // else { // Maybe CSS or Meta
        
                        //     throw Error('Not implemented');
                        // }
                    });
        
                    // Add the new content
                    Array.from(body.childNodes).forEach(child => {
        
                        if ((child as HTMLElement).tagName === 'SCRIPT') {
        
                            const newScript = createScriptNode(child as HTMLElement, value as string);
        
                            document.body.appendChild(newScript);
                        }
                        else { // Add it to this component
        
                            d.appendChild(child);
                        }
                    });

                }
            }
        };
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            tempRoute
        } = appCtrl;

        appCtrl.contentView = this;

        if (tempRoute !== undefined) {

            this.source = tempRoute;
        }
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        appCtrl.contentView = undefined;
    }
}

defineCustomElement('wcl-content-view', ContentView);