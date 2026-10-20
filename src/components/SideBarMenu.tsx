import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NavLink, useLocation } from "react-router-dom";
import menu from "../components/menu";
import logoMark from "../assets/images/logo2.png";
import { useThemeStore } from "../stores/themeStore";
import { KeyboardArrowRight } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
import useLocalStorage from "../hooks/useLocalStorage";
import useMediaQuery from "@mui/material/useMediaQuery";

type CloseDrawer = (open: boolean) => void;

const normalizePath = (path = "") =>
  `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "").toLowerCase();

const containsActiveRoute = (item: any, pathname: string): boolean => {
  const currentPath = normalizePath(pathname);
  const itemPath = normalizePath(item.route);
  const matchesRoute =
    item.route &&
    (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`));

  return Boolean(
    matchesRoute ||
      item.children?.some((child: any) =>
        containsActiveRoute(child, pathname)
      )
  );
};

function SingleRender({
  item,
  isChild,
  closeDrawer,
}: {
  item: any;
  isChild?: boolean;
  closeDrawer?: CloseDrawer;
}) {
  const { roles, name } = useLocalStorage();
  const matches = useMediaQuery("(min-width:1200px)");

  return (
    (roles?.includes(item.role) || name === "admin") && (
      <ListItem
        disablePadding
        sx={{
          display: "block",
          px: 1.25,
          py: isChild ? 0 : 0.25,
        }}
        key={item.id}
      >
        <ListItemButton
          component={NavLink}
          onClick={() => !matches && closeDrawer?.(false)}
          to={item.route}
          sx={{
            position: "relative",
            minHeight: isChild ? 38 : 44,
            pl: isChild ? 3.5 : 1.5,
            pr: 1.5,
            borderRadius: 2,
            color: "text.secondary",
            textDecoration: "none",
            transition:
              "background-color 160ms ease, color 160ms ease, transform 160ms ease",
            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
              transform: "translateX(2px)",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: -2,
            },
            '&[aria-current="page"]': {
              bgcolor: (theme) =>
                `${alpha(theme.palette.primary.main, 0.12)} !important`,
              color: "primary.main",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 9,
                bottom: 9,
                width: 3,
                borderRadius: "0 3px 3px 0",
                bgcolor: "primary.main",
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: "inherit",
              "& .MuiSvgIcon-root": { fontSize: isChild ? 19 : 21 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontSize: isChild ? "0.875rem" : "0.925rem",
              fontWeight: 500,
              noWrap: true,
            }}
          />
        </ListItemButton>
      </ListItem>
    )
  );
}

function NestedRender({
  item,
  isChild,
  closeDrawer,
}: {
  item: any;
  isChild?: boolean;
  closeDrawer?: CloseDrawer;
}) {
  const { roles, name } = useLocalStorage();
  const { pathname } = useLocation();
  const isActiveGroup = containsActiveRoute(item, pathname);
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  useEffect(() => {
    if (isActiveGroup) setIsOpen(true);
  }, [isActiveGroup]);

  return (
    (roles?.includes(item.role) || name === "admin") && (
      <List
        disablePadding
        dense
        key={item.title}
        sx={{ px: 1.25, py: isChild ? 0 : 0.25 }}
      >
        <ListItemButton
          aria-expanded={isOpen}
          sx={{
            minHeight: isChild ? 40 : 46,
            px: 1.5,
            pl: isChild ? 2.5 : 1.5,
            borderRadius: 2,
            color: isActiveGroup ? "primary.main" : "text.primary",
            bgcolor: (theme) =>
              isActiveGroup
                ? alpha(theme.palette.primary.main, 0.08)
                : "transparent",
            transition: "background-color 160ms ease, color 160ms ease",
            "&:hover": {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  isActiveGroup ? 0.12 : 0.06
                ),
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: -2,
            },
          }}
          onClick={() => setIsOpen((open) => !open)}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: "inherit",
              "& .MuiSvgIcon-root": { fontSize: isChild ? 19 : 21 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              fontSize: isChild ? "0.875rem" : "0.925rem",
              fontWeight: isActiveGroup ? 600 : 500,
              noWrap: true,
            }}
          />
          {isOpen ? (
            <KeyboardArrowDown sx={{ ml: 1, fontSize: 20 }} />
          ) : (
            <KeyboardArrowRight sx={{ ml: 1, fontSize: 20 }} />
          )}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {item?.children?.map((child: any) =>
            child.children ? (
              <NestedRender
                key={child.title}
                item={child}
                isChild={true}
                closeDrawer={closeDrawer}
              />
            ) : (
              <SingleRender
                key={child.title}
                item={child}
                isChild={true}
                closeDrawer={closeDrawer}
              />
            )
          )}
        </Collapse>
      </List>
    )
  );
}

function BrandHeader() {
  const mode = useThemeStore((state) => state.mode);

  return (
    <Box
      sx={{
        position: "relative",
        px: 2,
        pt: 2.25,
        pb: 2,
        overflow: "hidden",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? `linear-gradient(165deg, ${alpha(
                theme.palette.primary.main,
                0.22
              )} 0%, ${theme.palette.background.paper} 70%)`
            : `linear-gradient(165deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${theme.palette.background.paper} 72%)`,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 18,
          bottom: 18,
          width: 3,
          borderRadius: "0 3px 3px 0",
          background: (theme) =>
            `linear-gradient(180deg, ${theme.palette.primary.main} 0%, #c62828 50%, #f9a825 100%)`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 52,
            height: 52,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: mode === "dark" ? "common.black" : "common.black",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0 8px 20px ${alpha(theme.palette.common.black, 0.35)}`
                : `0 6px 16px ${alpha(theme.palette.primary.main, 0.18)}`,
          }}
        >
          <Box
            component="img"
            src={logoMark}
            alt="Inspektion Solution"
            sx={{
              width: 36,
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: "0.78rem",
              lineHeight: 1.15,
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: "text.primary",
            }}
          >
            Inspektion
          </Typography>
          <Typography
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: "0.78rem",
              lineHeight: 1.15,
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            Solution
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.65,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: 1.1,
              textTransform: "uppercase",
            }}
          >
            Inspection Portal
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SideBarMenu({
  headerHeight,
  closeDrawer,
}: {
  headerHeight?: number;
  closeDrawer?: CloseDrawer;
}) {
  return (
    <Box
      sx={{
        height: headerHeight ? "100vh" : `calc(100vh - 64px)`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "background.paper",
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <BrandHeader />

      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          flex: 1,
          minHeight: 0,
          py: 1.25,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: (theme) =>
            `${theme.palette.divider} transparent`,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 3,
          },
        }}
      >
        {menu.map((item, index) =>
          item?.children ? (
            <NestedRender key={index} item={item} closeDrawer={closeDrawer} />
          ) : (
            <SingleRender key={index} item={item} closeDrawer={closeDrawer} />
          )
        )}
      </Box>
    </Box>
  );
}

export default SideBarMenu;
