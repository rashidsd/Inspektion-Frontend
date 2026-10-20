import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import Person from "@mui/icons-material/Person";
import Person2 from "@mui/icons-material/Person2";
import CropFreeIcon from "@mui/icons-material/CropFree";
import ArticleIcon from "@mui/icons-material/Article";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

const menu = [
  {
    id: 1,
    title: "Master Inputs",
    role: "Master Inputs",
    icon: <PermDataSettingIcon />,
    route: "/inputs",
    children: [
      {
        id: 1,
        title: "Add Client",
        role: "Add Client",
        route: "/addClient",
        icon: <Person />,
      },
      {
        id: 2,
        title: "Add Vendor",
        role: "Add Vendor",
        route: "/addVendor",
        icon: <Person2 />,
      },
      {
        id: 9,
        title: "Add Inspector",
        role: "Add Inspector",
        route: "/addInspector",
        icon: <FolderSharedIcon />,
      },
      {
        id: 3,
        title: "Add Color",
        role: "Add Color",
        route: "/addColor",
        icon: <ColorLensIcon />,
      },
      {
        id: 4,
        title: "Add Size",
        role: "Add Size",
        route: "/addSize",
        icon: <FullscreenExitIcon />,
      },

      {
        id: 5,
        title: "Add Category",
        role: "Add Category",
        route: "/addCategory",
        icon: <AccountTreeIcon />,
      },
      {
        id: 6,
        title: "Parent Article",
        role: "Parent Article",
        route: "/parentArticle",
        icon: <CropFreeIcon />,
      },
      {
        id: 7,
        title: "Add Article",
        role: "Add Article",
        route: "/addArticle",
        icon: <WebAssetIcon />,
      },
      {
        id: 8,
        title: "Article List",
        role: "Article List",
        route: "/articleList",
        icon: <ArticleIcon />,
      },
    ],
  },
];
export default menu;
