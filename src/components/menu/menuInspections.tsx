import QueueIcon from "@mui/icons-material/Queue";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const menu = [
  {
    id: 4,
    title: "Inspection Management",
    role: "Inspectins Management",
    icon: <QueueIcon />,
    children: [
      {
        id: 1,
        title: "Final Inspection",
        role: "Final Inspection",
        route: "/inspection/finalnspection",
        icon: <PlaylistAddCheckIcon />,
      },
    ],
  },
];

export default menu;
