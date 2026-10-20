import Settings from "@mui/icons-material/Settings";
import Person from "@mui/icons-material/Person";
import CollectionsIcon from "@mui/icons-material/Collections";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const menu = [
  {
    id: 1,
    title: "Settings",
    role: "Settings",
    icon: <Settings />,
    route: "/settings",
    children: [
      {
        id: 1,
        title: "Manage Users",
        role: "Manage Users",
        route: "/manageUsers",
        icon: <Person />,
      },
      {
        id: 2,
        title: "Manage Role's Group",
        role: "Manage Role Group",
        route: "/manageRoleGroup",
        icon: <CollectionsIcon />,
      },
      {
        id: 3,
        title: "Manage Role",
        role: "Manage Roles",
        route: "/manageRoles",
        icon: <ViewSidebarIcon />,
      },
      {
        id: 4,
        title: "Assign Roles",
        role: "Assign Roles",
        route: "/assignRoles",
        icon: <SettingsAccessibilityIcon />,
      },
      {
        id: 5,
        title: "Change Password",
        role: "Change Password",
        route: "/changePassword",
        icon: <PublishedWithChangesIcon />,
      },
      {
        id: 5,
        title: "Upload Data",
        role: "Upload Data",
        route: "/uploadData",
        icon: <CloudUploadIcon />,
      },
    ],
  },
];
export default menu;
