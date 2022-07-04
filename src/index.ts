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
import Badge from "./components/badge/Badge";
import Button from "./components/button/Button";
import ToolTip from "./components/tool-tip/ToolTip";
import DataTemplate from "./components/data-template/DataTemplate";
import Selector from "./components/selector/Selector";
import DropDown from "./components/drop-down/DropDown";

// Layout
import Row from "./components/row/Row";
import Overlay from "./components/overlay/Overlay";

// Data
import Loader from "./components/loader/Loader";

// Tools
import CloseTool from "./components/tools/close/CloseTool";
import ExpanderTool from "./components/tools/expander/ExpanderTool";
import SorterTool from "./components/tools/sorter/SorterTool";
import Tool from "./components/tools/Tool";

// Fields
import ComboBox from "./components/fields/combo-box/ComboBox";
import DateField from "./components/fields/date/DateField";
import FileField from "./components/fields/file/FileField";
import HiddenField from "./components/fields/hidden/HiddenField";
import TextField from "./components/fields/text/TextField";
import Slider from "./components/fields/slider/Slider";

// Form
import FormField from "./components/form/form-field/FormField";
import Form from "./components/form/Form";
import ValidationSummary from "./components/validation-summary/ValidationSummary";

// Display
import DataList from "./components/data-list/DataList";

import { GenericRecord } from "./utils/types";


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
    Badge,
    Button,
    ToolTip,
    DataTemplate,
    Selector,
    DropDown,

    // Layout
    Row,
    Overlay,

    // Data
    Loader,

    // Tools
    Tool,
    CloseTool,
    ExpanderTool as DropTool,
    SorterTool,
    
    // Fields 
    TextField,
    DateField,
    FileField,
    ComboBox,
    HiddenField,
    Slider,

    // Form
    FormField,
    Form,
    ValidationSummary,

    // Display
    DataList
}