// Building blocks
import CustomHTMLElementConstructor from "./custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import CustomElement from "./custom-element/CustomElement";
import defineCustomElement from "./custom-element/defineCustomElement";
import CustomElementComponentMetadata from "./custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "./custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "./rendering/nodes/NodePatchingData";
import html from "./rendering/html";

// Components
import Icon from "./components/icon/Icon";
import LocalizedText from "./components/localized-text/LocalizedText";
import Alert from "./components/alert/Alert";
import Button from "./components/button/Button";
import DataTemplate from "./components/data-template/DataTemplate";

// Layout
import Row from "./components/row/Row";
import Overlay from "./components/overlay/Overlay";

// Data
import Loader from "./components/loader/Loader";

// Fields
import ComboBox from "./components/fields/combo-box/ComboBox";
import DateField from "./components/fields/date/DateField";
import FileField from "./components/fields/file/FileField";
import HiddenField from "./components/fields/hidden/HiddenField";
import TextField from "./components/fields/text/TextField";
import Slider from "./components/fields/slider/Slider";
import { GenericRecord } from "./utils/types";

// Display
import DataList from "./components/data-list/DataList";

// Make it available in the global object of the browser
(window as unknown as GenericRecord).html = html;

export {
    // Building blocks
    CustomHTMLElementConstructor,
    CustomElement,
    CustomElementComponentMetadata,
    CustomElementPropertyMetadata,
    defineCustomElement,
    CustomElementStateMetadata,
    NodePatchingData,

    // Components
    Icon,
    LocalizedText,
    Alert,
    Button,
    DataTemplate,

    // Layout
    Row,
    Overlay,

    // Data
    Loader,

    // Fields 
    TextField,
    DateField,
    FileField,
    ComboBox,
    HiddenField,
    Slider,

    // Display
    DataList
}