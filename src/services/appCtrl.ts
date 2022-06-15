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
	 * Initializes the application controller
	 */
	init() {

		console.log('Initializing appCtrl...');

		const getAppConfig = (window as unknown as GenericRecord).getAppConfig as () => {
			errorHandler: ErrorHandler,
			intl: IntlProvider,
			iconsPath: string
		};

		if (getAppConfig !== undefined) {

			const {
				// auth,
				errorHandler,
				intl,
				iconsPath
			} = getAppConfig();

			// if (auth !== undefined) {

			// 	appCtrl.authProvider = new OidcProvider(auth);
			// }

			if (intl !== undefined) {

				appCtrl.intlProvider = new IntlProvider(intl.lang, intl.data);
			}

			appCtrl.errorHandler = errorHandler !== undefined ?
				errorHandler :
				new AppErrorHandler();

			appCtrl.iconsPath = iconsPath;
		}
		else { // No configuration was provided, provide a default error handler

			appCtrl.errorHandler = new AppErrorHandler();
		}
	}
}

const appCtrl = new AppCtrl();

appCtrl.init();

export default appCtrl;