import IntlResource from "../../utils/intl/IntlResource";
import RouteGroup from "./RouteGroup";

export default interface Route extends IntlResource {

    /**
     * The path to get the view
     */
    path: string;

    /**
     * The view to be rendered
     */
    view: string;

    /**
     * The group of the route
     */
    group: RouteGroup
}