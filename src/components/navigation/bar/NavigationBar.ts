import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Route from "../../../services/routing/Route";
import { DataTypes } from "../../../utils/data/DataTypes";
import IntlResource from "../../../utils/intl/IntlResource";
import NavigationLink, { linkClickedEvent } from "../link/NavigationLink";
import { navigationBarStyles } from "./NavigationBar.styles";

export default class NavigationBar extends CustomElement {

    activeLink?: NavigationLink;

    static get styles(): string {

        return mergeStyles(super.styles, navigationBarStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The routes used by this navigation bar
             */
            routes: {
                type: [
                    DataTypes.Object,
                    DataTypes.Function
                ]
            },
        }
    }

    constructor() {

        super();

        this.updateActiveLink = this.updateActiveLink.bind(this);
    }

    connectedCallback(): void {

        super.connectedCallback?.();

        this.addEventListener(linkClickedEvent, this.updateActiveLink as EventListenerOrEventListenerObject);
    }

    disconnectedCallback(): void {

        super.disconnectedCallback?.();

        this.removeEventListener(linkClickedEvent, this.updateActiveLink as EventListenerOrEventListenerObject);
    }

    updateActiveLink(event: CustomEvent) {

        //event.stopPropagation(); We want it to propagate to the appCtrl object

        const {
            link,
        } = event.detail;

        // For links we assume that only a single link can be active at a time and it cannot be deactivated unless clicking a different one
        if (link !== this.activeLink) {

            if (this.activeLink !== undefined) {

                this.activeLink.active = false;
            }

            this.activeLink = link;
        }
    }

    render(): NodePatchingData {

        const {
            routes
        } = this;

        if (routes !== undefined) {

            return html`
<nav slot="start" class="sidebar">
    ${this.renderRoutes()}
</nav>`;

        }
        else {

            return html`<slot></slot>`;
        }
    }

    renderRoutes(): NodePatchingData[] {

        const {
            routes
        } = this;

        // Convert to array adding the key to the path
        const routesArray: Route[] = [];

        for (const [key, route] of Object.entries(routes)) {

            routesArray.push({
                ...(route as Route),
                path: key
            });
        }

        const processedGroups = new Set<IntlResource>();

        const links: NodePatchingData[] = [];

        const length = routesArray.length;

        for (let i = 0; i < length; ++i) {

            const route = routesArray[i];

            const {
                group
            } = route;

            if (group !== undefined) {

                if (processedGroups.has(group)) {

                    continue;
                }

                processedGroups.add(group);

                const groupedRoutes = routesArray.filter(r => r.group === group);

                links.push(html`
<wcl-panel>
    ${group.intlKey !== undefined ?
                        html`<wcl-localized-text intl-key=${group.intlKey} slot="header">${group.text}</wcl-localized-text>` :
                        html`<div slot="header">${group.text}</div>`}
    ${this.renderGroupedRoutes(groupedRoutes)}
</wcl-panel>`);
            }
            else { // Push the ungrouped route

                links.push(this.renderRoute(route));
            }
        }

        return links;
    }

    private renderGroupedRoutes(groupedRoutes: Route[]): NodePatchingData[] {

        return groupedRoutes.map(r => this.renderRoute(r, 'body'));
    }

    private renderRoute(route: Route, slot: string | null = null): NodePatchingData {

        const {
            path,
            intlKey,
            text
        } = route as Route;

        return html`
<wcl-nav-link to=${path} key=${path} slot=${slot}>
    ${intlKey !== undefined ?
                html`<wcl-localized-text intl-key=${intlKey}>${text}</wcl-localized-text>` :
                text}
</wcl-nav-link>`;
    }
}

defineCustomElement('wcl-nav-bar', NavigationBar);