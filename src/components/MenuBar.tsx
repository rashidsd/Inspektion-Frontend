import { useState, type ReactNode } from "react";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import menu from "./menu";
import useLocalStorage from "../hooks/useLocalStorage";

type MenuEntry = {
  id?: number;
  title: string;
  role: string;
  icon?: ReactNode;
  route?: string;
  children?: MenuEntry[];
};

const normalizePath = (path = "") =>
  `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "").toLowerCase();

function MenuBar() {
  const { roles, name } = useLocalStorage();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openPath, setOpenPath] = useState<string[]>([]);

  const canSee = (item: MenuEntry) =>
    roles?.includes(item.role) || name === "admin";

  const isActive = (item: MenuEntry): boolean => {
    const currentPath = normalizePath(pathname);
    const itemPath = normalizePath(item.route);
    const routeMatches =
      Boolean(item.route) &&
      (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`));

    return Boolean(
      routeMatches || item.children?.some((child) => isActive(child))
    );
  };

  const closeMenus = () => {
    setOpenMenu(null);
    setOpenPath([]);
  };

  const goTo = (route?: string) => {
    if (!route) return;
    closeMenus();
    navigate(normalizePath(route));
  };

  const openAtDepth = (depth: number, key: string) => {
    setOpenPath((current) => {
      const next = current.slice(0, depth);
      next[depth] = key;
      return next;
    });
  };

  const renderDropdownItem = (
    item: MenuEntry,
    depth: number,
    keyPath: string
  ): ReactNode => {
    if (!canSee(item)) return null;

    const itemKey = `${keyPath}-${item.id ?? item.title}`;
    const visibleChildren = item.children?.filter(canSee) ?? [];
    const isOpen = openPath[depth] === itemKey;

    if (visibleChildren.length) {
      return (
        <Box
          key={itemKey}
          sx={{ position: "relative" }}
          onMouseEnter={() => openAtDepth(depth, itemKey)}
        >
          <MenuItem sx={{ py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{ fontSize: 13 }}
            />
            <ChevronRight fontSize="small" sx={{ ml: 1 }} />
          </MenuItem>
          {isOpen && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: 0,
                left: "100%",
                zIndex: (theme) => theme.zIndex.appBar + depth + 2,
                minWidth: 220,
                py: 0.5,
                overflow: "visible",
              }}
            >
              <MenuList dense disablePadding>
                {visibleChildren.map((child, index) =>
                  renderDropdownItem(child, depth + 1, `${itemKey}-${index}`)
                )}
              </MenuList>
            </Paper>
          )}
        </Box>
      );
    }

    return (
      <MenuItem
        key={itemKey}
        selected={isActive(item)}
        onClick={() => goTo(item.route)}
        onMouseEnter={() =>
          setOpenPath((current) => current.slice(0, depth))
        }
        sx={{ py: 0.75 }}
      >
        <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{ fontSize: 13 }}
        />
      </MenuItem>
    );
  };

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 0.25,
        flex: 1,
        minWidth: 0,
        overflow: "visible",
      }}
    >
      {(menu as MenuEntry[]).map((item, index) => {
        if (!canSee(item)) return null;

        const visibleChildren = item.children?.filter(canSee) ?? [];
        const itemKey = `${item.id ?? item.title}-${index}`;
        const isOpen = openMenu === itemKey;

        if (!visibleChildren.length) {
          return (
            <Button
              key={itemKey}
              color="inherit"
              size="small"
              onClick={() => goTo(item.route)}
              onMouseEnter={closeMenus}
              sx={{
                px: 1.25,
                minWidth: 0,
                textTransform: "none",
                whiteSpace: "nowrap",
                fontWeight: isActive(item) ? 700 : 500,
              }}
            >
              {item.title}
            </Button>
          );
        }

        return (
          <Box
            key={itemKey}
            onMouseEnter={() => {
              setOpenMenu(itemKey);
              setOpenPath([]);
            }}
            onMouseLeave={closeMenus}
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Button
              color="inherit"
              size="small"
              endIcon={<ExpandMore fontSize="small" />}
              sx={{
                px: 1.25,
                minWidth: 0,
                textTransform: "none",
                whiteSpace: "nowrap",
                fontWeight: isActive(item) ? 700 : 500,
                bgcolor: isOpen ? "action.selected" : "transparent",
              }}
            >
              {item.title}
            </Button>
            {isOpen && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: (theme) => theme.zIndex.appBar + 1,
                  minWidth: 230,
                  py: 0.5,
                  overflow: "visible",
                }}
              >
                <MenuList dense disablePadding>
                  {visibleChildren.map((child, childIndex) =>
                    renderDropdownItem(
                      child,
                      0,
                      `${itemKey}-${childIndex}`
                    )
                  )}
                </MenuList>
              </Paper>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default MenuBar;
