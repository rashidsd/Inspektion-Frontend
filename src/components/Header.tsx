import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import logoMark from "../assets/images/logo2.png";
import Logout from "@mui/icons-material/Logout";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import SideBarMenu from "./SideBarMenu";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import {
  NavLayout,
  PRESET_COLORS,
  ThemeMode,
  useThemeStore,
} from "../stores/themeStore";
import MenuBar from "./MenuBar";

function Header({
  hideSideBar,
  setHideSideBar,
}: {
  hideSideBar?: boolean;
  setHideSideBar?: any;
}) {
  const [open, setOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const { name, user_type } = useLocalStorage();
  const mode = useThemeStore((state) => state.mode);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const navLayout = useThemeStore((state) => state.navLayout);
  const setMode = useThemeStore((state) => state.setMode);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const setNavLayout = useThemeStore((state) => state.setNavLayout);
  const navigate = useNavigate();

  const handelLogOut = () => {
    setProfileAnchor(null);
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: ThemeMode | null
  ) => {
    if (value) setMode(value);
  };

  const handleNavLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: NavLayout | null
  ) => {
    if (value) setNavLayout(value);
  };

  const handleSettings = () => {
    setProfileAnchor(null);
    navigate("/ChangePassword");
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={mode === "dark" ? 0 : 2}
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: (theme) =>
            theme.palette.mode === "dark" ? "text.primary" : "common.white",
          borderBottom: (theme) =>
            theme.palette.mode === "dark"
              ? `1px solid ${theme.palette.divider}`
              : "none",
        }}
      >
        <Box sx={{ px: 2 }}>
          <Toolbar disableGutters>
            <Box component="div" sx={{ display: { md: "flex", lg: "none" } }}>
              <IconButton
                onClick={() => setOpen(true)}
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <IconButton
              onClick={() => setHideSideBar(!hideSideBar)}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                display:
                  navLayout === "sidebar"
                    ? { xs: "none", lg: "flex" }
                    : "none",
              }}
            >
              {hideSideBar ? (
                <OpenInFullIcon sx={{ fontSize: 24 }} />
              ) : (
                <CloseFullscreenIcon sx={{ fontSize: 24 }} />
              )}
            </IconButton>
            <Box
              component="div"
              sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center" }}
            >
              <Box
                component="img"
                src={logoMark}
                alt="Inspektion Solution"
                sx={{
                  height: 30,
                  width: "auto",
                  display: "block",
                  filter: mode === "dark" ? "none" : "brightness(0) invert(1)",
                }}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexGrow: 1, minWidth: 0, overflow: "visible" }}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  mr: navLayout === "menubar" ? 2 : 0,
                  ml: 1.5,
                  flexGrow: navLayout === "sidebar" ? 1 : 0,
                  flexShrink: 0,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: "inherit",
                  // Brand lives in the sidebar; keep title only for menubar / mobile.
                  display:
                    navLayout === "sidebar"
                      ? { xs: "block", lg: "none" }
                      : "block",
                }}
              >
                INSPEKTION SOLUTION
              </Typography>
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  flex: 1,
                  minWidth: 0,
                  overflow: "visible",
                }}
              >
                {navLayout === "menubar" && <MenuBar />}
              </Box>
              {navLayout === "sidebar" && (
                <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "block" } }} />
              )}
              <Tooltip title={name || "Account"}>
                <IconButton
                  onClick={(event) => setProfileAnchor(event.currentTarget)}
                  aria-label="Open profile menu"
                  aria-controls={profileAnchor ? "profile-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={profileAnchor ? "true" : undefined}
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: mode === "dark" ? "primary.main" : "common.white",
                      color: mode === "dark" ? "primary.contrastText" : "primary.main",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <Menu
        id="profile-menu"
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { width: 270 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user_type || "Account"}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ display: "block", mb: 1 }}
          >
            APPEARANCE
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              Theme
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={mode}
              onChange={handleModeChange}
              aria-label="Theme"
            >
              <ToggleButton value="light" aria-label="Light theme">
                <LightMode fontSize="small" />
              </ToggleButton>
              <ToggleButton value="dark" aria-label="Dark theme">
                <DarkMode fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <Typography variant="body2" sx={{ flex: 1 }}>
              Navigation
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={navLayout}
              onChange={handleNavLayoutChange}
              aria-label="Navigation layout"
            >
              <ToggleButton value="sidebar" aria-label="Sidebar">
                <ViewSidebarIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="menubar" aria-label="Menu bar">
                <WebAssetIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography variant="body2" sx={{ mb: 0.75 }}>
            Accent color
          </Typography>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {PRESET_COLORS.map((color) => (
              <Tooltip key={color.value} title={color.label} arrow>
                <ButtonBase
                  onClick={() => setPrimaryColor(color.value)}
                  aria-label={`${color.label} accent color`}
                  aria-pressed={primaryColor === color.value}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: color.value,
                    border: "2px solid",
                    borderColor:
                      primaryColor === color.value ? "text.primary" : "transparent",
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "text.primary",
                      outlineOffset: 2,
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleSettings} sx={{ minHeight: 44 }}>
          <SettingsOutlined fontSize="small" sx={{ mr: 1.5 }} />
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handelLogOut}
          sx={{ minHeight: 44, color: "error.main" }}
        >
          <Logout fontSize="small" sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 300, overflow: "hidden" }}>
          <SideBarMenu headerHeight={64} closeDrawer={setOpen} />
        </Box>
      </Drawer>
    </>
  );
}
export default Header;
