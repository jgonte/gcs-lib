import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import IntlProvider from "../../services/IntlProvider";
import { DataTypes } from "../../utils/data/DataTypes";
import Kind from "../mixins/kind/Kind";
import Sizable from "../mixins/sizable/Sizable";
import { localizedTextStyles } from "./LocalizedText.styles";

export default class LocalizedText extends
    Sizable(
        Kind(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, localizedTextStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The key to retrieve a localized value from an i18n provider
             */
            resourceKey: {
                attribute: 'resource-key',
                type: DataTypes.String
            },

            /**
             * The language to translate to
             */
            lang: {
                type: DataTypes.String,
                reflect: true
            },

            /**
             * The value of the translated resource
             */
            value: {
                type: DataTypes.String,
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