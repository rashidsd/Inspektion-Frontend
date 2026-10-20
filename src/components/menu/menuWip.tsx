import SummarizeIcon from "@mui/icons-material/Summarize";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const menu = [
  {
    id: 4,
    title: "WIP Management",
    role: "WIP Management",
    icon: <SummarizeIcon />,
    route: "/#",
    children: [
      {
        id: 1,
        title: "WIP Data",
        role: "WIP Data",
        route: "/wipDataVendor",
        icon: <ListAltIcon />,
      },
      {
        id: 2,
        title: "WIP Report",
        role: "WIP Report",
        route: "/wipReport",
        icon: <FactCheckIcon />,
      },
    ],
  },
];

export default menu;
