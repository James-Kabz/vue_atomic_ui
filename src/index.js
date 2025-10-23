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
import Progress from "./components/Progress.vue"
import ProgressBar from "./components/ProgressBar.vue"
import Radio from "./components/Radio.vue"
import Select from "./components/Select.vue"
import Spinner from "./components/Spinner.vue"
import Switch from "./components/Switch.vue"
import Text from "./components/Text.vue"
import Textarea from "./components/Textarea.vue"
import Tooltip from "./components/Tooltip.vue"
import Typography from "./components/Typography.vue"

import Alert from "./components/Alert.vue"
import Breadcrumb from "./components/Breadcrumb.vue"
import ButtonGroup from "./components/ButtonGroup.vue"
import Card from "./components/Card.vue"
import CardHeader from "./components/CardHeader.vue"
import CardBody from "./components/CardBody.vue"
import CardFooter from "./components/CardFooter.vue"
import CardContent from "./components/CardContent.vue"
import CardTitle from "./components/CardTitle.vue"
import DatePicker from "./components/DatePicker.vue"
import Dropdown from "./components/Dropdown.vue"
import DropdownItem from "./components/DropdownItem.vue"
import FileUpload from "./components/FileUpload.vue"
import FormField from "./components/FormField.vue"
import InputGroup from "./components/InputGroup.vue"

import ListItem from "./components/ListItem.vue"
import MenuItem from "./components/MenuItem.vue"

import Modal from "./components/Modal.vue"
import ModalHeader from "./components/ModalHeader.vue"
import ModalBody from "./components/ModalBody.vue"
import ModalFooter from "./components/ModalFooter.vue"
import Notification from "./components/Notification.vue"
import Toast from "./components/Toast.vue"

import Search from "./components/Search.vue"

import Slider from "./components/Slider.vue"
import Stepper from "./components/Stepper.vue"
import StepperItem from "./components/StepperItem.vue"
import Tab from "./components/Tab.vue"
import TabPanel from "./components/TabPanel.vue"

import Accordion from "./components/Accordion.vue"
import AccordionItem from "./components/AccordionItem.vue"
import Calendar from "./components/Calendar.vue"
import Graph from "./components/Graph.vue"
import BarChart from "./components/BarChart.vue"
import LineChart from "./components/LineChart.vue"
import GraphFilters from "./components/GraphFilters.vue"
import DataTable from "./components/DataTable.vue"
import DataTableHeader from "./components/DataTableHeader.vue"
import DataTableRow from "./components/DataTableRow.vue"
import DataTableCell from "./components/DataTableCell.vue"
import DataTablePagination from "./components/DataTablePagination.vue"
import DataTableFilters from "./components/DataTableFilters.vue"
import DataTableToolBar from "./components/DataTableToolBar.vue"

import Footer from "./components/Footer.vue"
import Header from "./components/Header.vue"
import ReusableFormModal from "./components/ReusableFormModal.vue"
import Sidebar from "./components/Sidebar.vue"
import Timeline from "./components/Timeline.vue"
import TimelineItem from "./components/TimelineItem.vue"

import AuthLayout from "./layouts/AuthLayout.vue"
import DefaultLayout from "./layouts/DefaultLayout.vue"
import ErrorLayout from "./layouts/ErrorLayout.vue"

// Import toast function and composable (not a component!)
import { toast, useToaster } from './lib/toast'
import { tooltip } from "./directives/tooltip.js"
// Utils
export { cn } from "./utils/cn.js"

// Styles
import "./styles/base.css"
import Loader from "./components/Loader.vue"

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
  Progress,
  ProgressBar,
  Radio,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  Tooltip,
  Typography,
  Loader,
  Alert,
  Breadcrumb,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardContent,
  CardTitle,
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
  BarChart,
  LineChart,
  GraphFilters,
  Accordion,
  AccordionItem,
  Graph,
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
  ReusableFormModal,
  Sidebar,
  Timeline,
  TimelineItem,
  AuthLayout,
  DefaultLayout,
  ErrorLayout,
}

// Plugin installer
const VueUI = {
  install(app, options = {}) {
    const { prefix = "" } = options
    
    Object.keys(components).forEach((name) => {
      const componentName = prefix ? `${prefix}${name}` : name
      app.component(componentName, components[name])
    })
    
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast)

    app.config.globalProperties.$tooltip = tooltip
    app.provide('tooltip', tooltip)
  },
}

// ✅ Default export (plugin install)
export default VueUI

// ✅ Named exports (for tree-shaking)
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
  Progress,
  ProgressBar,
  Radio,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  Tooltip,
  Typography,
  Loader,
  Alert,
  Breadcrumb,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardContent,
  CardTitle,
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
  BarChart,
  GraphFilters,
  LineChart,
  Stepper,
  StepperItem,
  Tab,
  TabPanel,
  Accordion,
  Graph,
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
  ReusableFormModal,
  Sidebar,
  Timeline,
  TimelineItem,
  AuthLayout,
  DefaultLayout,
  ErrorLayout,
  // Export toast function and composable
  toast,
  useToaster,
  tooltip
}