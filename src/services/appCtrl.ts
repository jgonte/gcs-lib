import ContentView from "../components/content-view/ContentView";
import Dialog from "../components/dialog.ts/Dialog";
import { linkClickedEvent } from "../components/navigation/NavigationLink";
import { NodePatchingData } from "../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../utils/types";
import AppErrorHandler from "./errors/AppErrorHandler";
import ErrorHandler from "./errors/ErrorHandler";
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
	 * The content views to route the dynamic content into
	 */
	contentViews: Set<ContentView> = new Set<ContentView>();

	routes?: GenericRecord;

	/**
	 * Initializes the application controller
	 */
	init() {

		console.log('Initializing appCtrl...');

		const getAppConfig = (window as unknown as GenericRecord).getAppConfig as () => {
			errorHandler: ErrorHandler,
			intl: IntlProvider,
			iconsPath: string,
			routes: GenericRecord
		};

		if (getAppConfig !== undefined) {

			const {
				// auth,
				errorHandler,
				intl,
				iconsPath,
				routes
			} = getAppConfig();

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				const lang = intl.lang || window.document.documentElement.getAttribute('lang') || window.navigator.language;

				appCtrl.intlProvider = new IntlProvider(lang, intl.data);
			}

			appCtrl.errorHandler = errorHandler !== undefined ?
				errorHandler :
				new AppErrorHandler();

			appCtrl.iconsPath = iconsPath;

			// Add routing
			if (routes !== undefined) {

				this.routes = routes;

				window.addEventListener(linkClickedEvent, evt => {

					this.route(evt as CustomEvent);
				});
	
				window.onpopstate = this.handleLocationChanged;
	
				this.handleLocationChanged();
			}	
		}
		else { // No configuration was provided, provide a default error handler

			appCtrl.errorHandler = new AppErrorHandler();
		}

		// Append the app dialog to post any messages
		document.body.appendChild(appCtrl.dialog);
	}

	showDialog(content: () => NodePatchingData) {

		const {
			dialog
		} = this;

		dialog.content = content;

		dialog.showing = true;
	}

	route(evt: CustomEvent): void {

		evt.preventDefault();

		const {
			link
		} = evt.detail;

		window.history.pushState({}, '', `${window.location}/${link.to}`);

		this.handleLocationChanged();
	}

	handleLocationChanged() {

		const {
			routes,
			contentViews
		} = this;

		const path = window.location.pathname;

		const route = (routes as GenericRecord)[path];

		const contentView = [...contentViews][0];

		contentView.source = route;
	}

}

const appCtrl = new AppCtrl();

appCtrl.init();

export default appCtrl;