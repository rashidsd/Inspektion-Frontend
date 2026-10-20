import Header from "./components/Header";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Outlet } from "react-router-dom";
import SideBarMenu from "./components/SideBarMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeStore } from "./stores/themeStore";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const matches = useMediaQuery("(min-width:1200px)");
  const sidebarWidth = 270;
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [hideSideBar, setHideSideBar] = useState(false);
  const navLayout = useThemeStore((state) => state.navLayout);
  const useMenuBar = matches && navLayout === "menubar";

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      setIsLogin(true);
    }
  });

  return (
    <>
      {!isLogin ? null : (
        <>
          <Box
            sx={{
              position: "fixed",
              width: "100%",
              zIndex: 1000,
            }}
          >
            <Header hideSideBar={hideSideBar} setHideSideBar={setHideSideBar} />
          </Box>
          <Box sx={{ height: 64 }} />
          <Box
            sx={{
              display: "flex",
              bgcolor: "background.default",
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                width:
                  matches && !hideSideBar && !useMenuBar ? sidebarWidth : 0,
                minWidth:
                  matches && !hideSideBar && !useMenuBar ? sidebarWidth : 0,
                overflow: "hidden",
                flexShrink: 0,
                transition: "width 0.25s ease, min-width 0.25s ease",
              }}
            >
              <SideBarMenu />
            </Box>
            <Box
              component={"div"}
              sx={{
                p: 2,
                flex: 1,
                minWidth: 0,
                height: "calc(100vh - 64px)",
                overflowY: "auto",
                transition: "width 0.25s ease",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
