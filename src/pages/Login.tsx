import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonBase from "@mui/material/ButtonBase";
import Menu from "@mui/material/Menu";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import logoMark from "../assets/images/logo2.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { useState, useEffect } from "react";
import ERPSnakBar from "../components/ERPSnakBar";
import { LoginType } from "../customTypes/customTypes";
import { userLogin } from "../services/loginService";
import { useNavigate } from "react-router-dom";
import {
  PRESET_COLORS,
  ThemeMode,
  useThemeStore,
} from "../stores/themeStore";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginIn, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [themeAnchor, setThemeAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const mode = useThemeStore((state) => state.mode);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const setMode = useThemeStore((state) => state.setMode);
  const setPrimaryColor = useThemeStore((state) => state.setPrimaryColor);
  const [login, setLoign] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: ThemeMode | null
  ) => {
    if (value) setMode(value);
  };

  const handleLogin = async () => {
    if (!login.email || !login.password || submitting) return;
    setSubmitting(true);
    try {
      const res: any = await userLogin(login);
      if (res.status) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      navigate("/", { replace: true });
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.response ? error.response.data.msg : error.message,
        serverity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/", { replace: true });
    } else {
      setIsLogin(false);
    }
  });

  return (
    <>
      {isLoginIn ? null : (
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            bgcolor: "background.default",
            color: "text.primary",
            position: "relative",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 2,
              borderRadius: 2,
            }}
          >
            <Tooltip title="Appearance">
              <IconButton
                onClick={(e) => setThemeAnchor(e.currentTarget)}
                aria-label="Open theme settings"
                size="small"
                sx={{ m: 0.25 }}
              >
                <PaletteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
          <Menu
            anchorEl={themeAnchor}
            open={Boolean(themeAnchor)}
            onClose={() => setThemeAnchor(null)}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{ paper: { sx: { width: 270, mt: 1 } } }}
          >
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
                          primaryColor === color.value
                            ? "text.primary"
                            : "transparent",
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
          </Menu>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "45%",
              position: "relative",
              overflow: "hidden",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: "primary.contrastText",
              px: 6,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 420,
                height: 420,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                top: -140,
                left: -140,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                bottom: -100,
                right: -100,
              }}
            />

            <Box
              sx={{
                borderRadius: "50%",
                width: 130,
                height: 130,
                backgroundColor: "rgba(255,255,255,0.12)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <img
                src={logoMark}
                alt="Inspektion Solution"
                style={{ width: 92, height: "auto", filter: "brightness(0) invert(1)" }}
              />
            </Box>

            <Typography variant="h4" fontWeight={700} letterSpacing={0.5} textAlign="center">
              INSPEKTION SOLUTION
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ mt: 1, opacity: 0.85, textAlign: "center", maxWidth: 320 }}
            >
              Inspection Portal
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 5, opacity: 0.85 }}>
              <VerifiedUserOutlinedIcon fontSize="small" />
              <Typography variant="body2">Secure access for authorized staff</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 380 }}>
              <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", mb: 3 }}>
                <img src={logoMark} alt="Inspektion Solution" style={{ height: 48, width: "auto" }} />
              </Box>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Welcome back, please enter your details.
              </Typography>

              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2.5,
                }}
              >
                <TextField
                  name="email"
                  variant="outlined"
                  label="E-Mail"
                  size="small"
                  fullWidth
                  autoFocus
                  value={login.email}
                  onChange={(e) => setLoign({ ...login, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ color: "action.active", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  name="password"
                  variant="outlined"
                  label="Password"
                  size="small"
                  fullWidth
                  value={login.password}
                  onChange={(e) => setLoign({ ...login, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  slotProps={{
                    input: {
                      type: showPassword ? "text" : "password",
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "action.active", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            edge="end"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <VisibilityOffIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Typography
                  component={"a"}
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    alignSelf: "flex-end",
                    color: "text.secondary",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  Forgot password?
                </Typography>

                <Button
                  sx={{ mt: 1, width: "100%", py: 1.1, fontWeight: 600, textTransform: "none" }}
                  variant="contained"
                  size="large"
                  disabled={!login.email || !login.password || submitting}
                  onClick={handleLogin}
                >
                  {submitting ? <CircularProgress size={22} color="inherit" /> : "Login"}
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 5 }}
              >
                © {new Date().getFullYear()} Inspektion Solution — Inspection Portal
              </Typography>
            </Box>
          </Box>

          <ERPSnakBar
            open={alert.open}
            onClose={() => setAlert({ open: false, message: "", serverity: "" })}
            serverity={alert.serverity}
            message={alert.message}
          />
        </Box>
      )}
    </>
  );
}

export default Login;
