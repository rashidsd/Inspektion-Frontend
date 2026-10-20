import NewspaperIcon from "@mui/icons-material/Newspaper";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FilterFramesIcon from "@mui/icons-material/FilterFrames";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const menu = [
  {
    id: 3,
    title: "Order Management",
    role: "Order Management",
    icon: <NewspaperIcon />,
    route: "/inputs",
    children: [
      {
        id: 1,
        title: "Add Order",
        role: "Add Order",
        route: "/addOrder",
        icon: <ListAltIcon />,
      },
      {
        id: 2,
        title: "Shipping Data",
        role: "Shipping Info",
        route: "shipData",
        icon: <LocalShippingIcon />,
      },
      {
        id: 3,
        title: "Order List",
        role: "Order List",
        route: "orderList",
        icon: <FilterFramesIcon />,
      },
      {
        id: 4,
        title: "Shipping List",
        role: "Shipping List",
        route: "shipList",
        icon: <ReceiptLongIcon />,
      },
      {
        id: 5,
        title: "Payment Form",
        role: "Payment Form",
        route: "paymentForm",
        icon: <ReceiptLongIcon />,
      },
       {
        id: 6,
        title: "Export Documents",
        role: "Export Documents",
        route: "exportDocuments",
        icon: <DocumentScannerIcon />,
      },
    ],
  },
];

export default menu;
