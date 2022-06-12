import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import IntlProvider from "../../services/IntlProvider";
import Kind from "../mixins/kind/Kind";
import { styles } from "./LocalizedText.styles";

export default class LocalizedText extends Kind(CustomElement as CustomHTMLElementConstructor) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The key to retrieve a localized value from an i18n provider
             */
            resourceKey: {
                attribute: 'resource-key',
                type: ConversionTypes.String
            },

            /**
             * The language to translate to
             */
            lang: {
                type: ConversionTypes.String,
                mutable: true,
                reflect: true
            },

            /**
             * The value of the translated resource
             */
            value: {
                type: ConversionTypes.String,
                mutable: true,
                reflect: true
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            lang,
            resourceKey
        } = this;

        if (resourceKey !== undefined) {

            const {
                intlProvider
            } = appCtrl;

            intlProvider?.subscribe(this);

            this.value = intlProvider?.getTranslation(lang, resourceKey);
        }
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        const {
            resourceKey
        } = this;

        if (resourceKey) {

            appCtrl.intlProvider?.unsubscribe(this);
        }
    }

    render(): NodePatchingData {

        const {
            value
        } = this;

        if (value === undefined) {

            return html`<slot></slot>`;
        }
        else {

            return html`${value}`;
        }
    }

    handleLanguageChanged(provider: IntlProvider) {

        const {
            resourceKey,
            lang
        } = this;

        this.value = provider.getTranslation(lang, resourceKey);
    }
}

defineCustomElement('wcl-localized-text', LocalizedText);