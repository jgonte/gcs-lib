import ContentView from "../components/content-view/ContentView";
import Dialog from "../components/dialog.ts/Dialog";
import { linkClickedEvent } from "../components/navigation/NavigationLink";
import html from "../rendering/html";
import { NodePatchingData } from "../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../utils/types";
import ErrorHandler, { errorEvent } from "./errors/ErrorHandler";
import IntlProvider from "./IntlProvider";

/**
 * The singleton application controller so it is accessable from everywhere
 */
class AppCtrl {
	/**
	 * The auth provider of the application
	 */
	//authProvider?: AuthProvider;

	/**
	 * The error handler of the application
	 */
	errorHandler?: ErrorHandler;

	/**
	 * The logged in user of the application
	 */
	//user?: AppUser;

	/**
	 * The internationalization provider of the app
	 */
	intlProvider?: IntlProvider;

	/**
	 * The path to the icons library
	 */
	iconsPath?: string;

	/**
	 * The dialog to show the messages for the application
	 */
	dialog: Dialog = new Dialog();

	/**
	 * The routes set in the app
	 */
	routes?: GenericRecord;

	/**
	 * The content view of the application
	 */
	contentView?: ContentView;

	/**
	 * The temporary route stored until the content view is connected
	 */
	tempRoute: unknown;

	/**
	 * The part of the path that does not change when routing
	 */
	rootPath: string = '';

	/**
	 * The root page of the application
	 */
	rootPage: string = 'index.html';

	/**
	 * Initializes the application controller
	 */
	init() {

		console.log('Initializing appCtrl...');

		const getAppConfig = (window as unknown as GenericRecord).getAppConfig as () => {
			errorHandler: ErrorHandler,
			intl: IntlProvider,
			iconsPath: string,
			routes: GenericRecord,
			rootPath: string,
			rootPage: string
		};

		if (getAppConfig !== undefined) {

			const {
				// auth,
				errorHandler,
				intl,
				iconsPath,
				routes,
				rootPath,
				rootPage
			} = getAppConfig();

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;

				appCtrl.intlProvider = new IntlProvider(lang, intl.data);
			}

			appCtrl.errorHandler = errorHandler;

			appCtrl.iconsPath = iconsPath;

			appCtrl.rootPath = rootPath || appCtrl.rootPath; // Set the root path before routing

			appCtrl.rootPage = rootPage || appCtrl.rootPage;

			// Add routing
			if (routes !== undefined) {

				this.routes = routes;

				window.addEventListener(linkClickedEvent, evt => {

					this.route(evt as CustomEvent);
				});

				window.onpopstate = this.handleLocationChanged;

				window.onload = () => this.handleLocationChanged(); // Wait until the page has been loaded
			}
		}

		// Append the app dialog to post any messages
		document.body.appendChild(appCtrl.dialog);

		document.addEventListener(errorEvent, this.handleError as EventListenerOrEventListenerObject);
	}

	showDialog(content: () => NodePatchingData) {

		const {
			dialog
		} = this;

		dialog.content = content;

		dialog.showing = true;
	}

	handleError(evt: CustomEvent): void {

		const {
			errorHandler
		} = this;

		if (errorHandler !== undefined) {

			errorHandler.handleError(evt);
		}
		else {

			const {
				error
			} = evt.detail;

			const content = () => html`<wcl-alert kind="danger" close>${error.message}</wcl-alert>`;

			appCtrl.showDialog(content);
		}
	}

	route(evt: CustomEvent): void {

		evt.preventDefault();

		const {
			link
		} = evt.detail;

		window.history.pushState({}, '', `${window.origin}${this.rootPath}${link.to}`);

		this.handleLocationChanged();
	}

	handleLocationChanged() {

		const {
			routes,
			contentView
		} = this;

		let path = window.location.pathname.substring(this.rootPath.length);

		if (path === `/${this.rootPage}`) {

			path = '/';
		}

		const route = (routes as GenericRecord)[path];

		if (contentView !== undefined) {

			contentView.source = `${this.rootPath}${route}`;
		}
		else {

			this.tempRoute = route; // Store the route until the content view is connected
		}
	}

}

const appCtrl = new AppCtrl();

appCtrl.init();

export default appCtrl;