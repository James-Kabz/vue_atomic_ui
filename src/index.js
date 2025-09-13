// Basic UI Components
import Avatar from "./components/Avatar.vue"
import Badge from "./components/Badge.vue"
import Button from "./components/Button.vue"
import Checkbox from "./components/Checkbox.vue"
import Divider from "./components/Divider.vue"
import Icon from "./components/Icon.vue"
import Image from "./components/Image.vue"
import Input from "./components/Input.vue"
import Label from "./components/Label.vue"
import Link from "./components/Link.vue"
import Logo from "./components/Logo.vue"
import Option from "./components/Option.vue"
import ProgressBar from "./components/ProgressBar.vue"
import Radio from "./components/Radio.vue"
import Select from "./components/Select.vue"
import Spinner from "./components/Spinner.vue"
import Switch from "./components/Switch.vue"
import Text from "./components/Text.vue"
import Textarea from "./components/Textarea.vue"
import Tooltip from "./components/Tooltip.vue"
import Typography from "./components/Typography.vue"

// Layout/Container Components
import Alert from "./components/Alert.vue"
import Breadcrumb from "./components/Breadcrumb.vue"
import ButtonGroup from "./components/ButtonGroup.vue"
import Card from "./components/Card.vue"
import CardHeader from "./components/CardHeader.vue"
import CardBody from "./components/CardBody.vue"
import CardFooter from "./components/CardFooter.vue"

// Form/Input Components
import DatePicker from "./components/DatePicker.vue"
import Dropdown from "./components/Dropdown.vue"
import DropdownItem from "./components/DropdownItem.vue"
import FileUpload from "./components/FileUpload.vue"
import FormField from "./components/FormField.vue"
import InputGroup from "./components/InputGroup.vue"

// List/Menu Components
import ListItem from "./components/ListItem.vue"
import MenuItem from "./components/MenuItem.vue"

// Modal/Overlay Components
import Modal from "./components/Modal.vue"
import ModalHeader from "./components/ModalHeader.vue"
import ModalBody from "./components/ModalBody.vue"
import ModalFooter from "./components/ModalFooter.vue"
import Notification from "./components/Notification.vue"
import Toast from "./components/Toast.vue"

// Navigation Components
import Search from "./components/Search.vue"

// Interactive Components
import Slider from "./components/Slider.vue"
import Stepper from "./components/Stepper.vue"
import StepperItem from "./components/StepperItem.vue"
import Tab from "./components/Tab.vue"
import TabPanel from "./components/TabPanel.vue"

// Complex Components
import Accordion from "./components/Accordion.vue"
import AccordionItem from "./components/AccordionItem.vue"
import Calendar from "./components/Calendar.vue"
import DataTable from "./components/DataTable.vue"
import DataTableHeader from "./components/DataTableHeader.vue"
import DataTableRow from "./components/DataTableRow.vue"
import DataTableCell from "./components/DataTableCell.vue"
import DataTablePagination from "./components/DataTablePagination.vue"
import DataTableFilters from "./components/DataTableFilters.vue"
import DataTableToolBar from "./components/DataTableToolBar.vue"

// Layout Section Components
import Footer from "./components/Footer.vue"
import Header from "./components/Header.vue"
import Sidebar from "./components/Sidebar.vue"
import Timeline from "./components/Timeline.vue"
import TimelineItem from "./components/TimelineItem.vue"

// Utilities
export { cn } from "./utils/cn.js"

// Styles
import "./styles/base.css"

// Export all components (named exports only)
export {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Divider,
  Icon,
  Image,
  Input,
  Label,
  Link,
  Logo,
  Option,
  ProgressBar,
  Radio,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  Tooltip,
  Typography,
  Alert,
  Breadcrumb,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DatePicker,
  Dropdown,
  DropdownItem,
  FileUpload,
  FormField,
  InputGroup,
  ListItem,
  MenuItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Notification,
  Toast,
  Search,
  Slider,
  Stepper,
  StepperItem,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  Calendar,
  DataTable,
  DataTableHeader,
  DataTableRow,
  DataTableCell,
  DataTablePagination,
  DataTableFilters,
  DataTableToolBar,
  Footer,
  Header,
  Sidebar,
  Timeline,
  TimelineItem,
}

// Plugin installer (named export instead of default)
export const VueAtomicUI = {
  install(app, options = {}) {
    const { prefix = "", globalComponents = true } = options

    if (globalComponents) {
      const components = {
        Avatar,
        Badge,
        Button,
        Checkbox,
        Divider,
        Icon,
        Image,
        Input,
        Label,
        Link,
        Logo,
        Option,
        ProgressBar,
        Radio,
        Select,
        Spinner,
        Switch,
        Text,
        Textarea,
        Tooltip,
        Typography,
        Alert,
        Breadcrumb,
        ButtonGroup,
        Card,
        CardHeader,
        CardBody,
        CardFooter,
        DatePicker,
        Dropdown,
        DropdownItem,
        FileUpload,
        FormField,
        InputGroup,
        ListItem,
        MenuItem,
        Modal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Notification,
        Toast,
        Search,
        Slider,
        Stepper,
        StepperItem,
        Tab,
        TabPanel,
        Accordion,
        AccordionItem,
        Calendar,
        DataTable,
        DataTableHeader,
        DataTableRow,
        DataTableCell,
        DataTablePagination,
        DataTableFilters,
        DataTableToolBar,
        Footer,
        Header,
        Sidebar,
        Timeline,
        TimelineItem,
      }

      Object.keys(components).forEach((name) => {
        const componentName = prefix ? `${prefix}${name}` : name
        app.component(componentName, components[name])
      })
    }
  },
}
