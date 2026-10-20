import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { use, useState } from "react";
import { Paper } from "@mui/material";
import ERPSnakBar from "../../components/ERPSnakBar";
import { ChangePasswordType } from "../../customTypes/customTypes";
import { passwordChange } from "../../services/settings/user_service";
import useLocalStorage from "../../hooks/useLocalStorage";

function ChangePassword() {
  const { id } = useLocalStorage();
  const [changePassword, setChangePassword] = useState<ChangePasswordType>({
    id: id,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleChange = (e: any) => {
    setChangePassword({ ...changePassword, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    if (
      changePassword.oldPassword === "" ||
      changePassword.newPassword === "" ||
      changePassword.confirmNewPassword === ""
    ) {
      setAlert({
        open: true,
        message: "All fields are required",
        serverity: "error",
      });
      return false;
    }
    if (changePassword.newPassword !== changePassword.confirmNewPassword) {
      setAlert({
        open: true,
        message: "New password and confirm password does not match",
        serverity: "error",
      });
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    console.log(changePassword);
    try {
      if (!isValid()) return;
      const res: any = await passwordChange(changePassword);
      setAlert({
        open: true,
        message: res.msg,
        serverity: "success",
      });
    } catch (error: any) {
      setAlert({
        open: true,
        message: error.response ? error.response.data.msg : error.message,
        serverity: "error",
      });
    }
  };

  return (
    <>
      <Box display={"flex"} sx={{ p: 6 }}>
        <Box
          component={Paper}
          elevation={3}
          width={400}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={2}
          sx={{ p: 4 }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: 19,
            }}
            textAlign={"center"}
            variant={"h5"}
            gutterBottom
            color="primary.main"
          >
            Change Password
          </Typography>

          <TextField
            name="oldPassword"
            label="Old Password"
            variant="outlined"
            type="password"
            value={changePassword.oldPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="newPassword"
            label="New Password"
            variant="outlined"
            type="password"
            value={changePassword.newPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="confirmNewPassword"
            label="Confirm New Password"
            variant="outlined"
            type="password"
            value={changePassword.confirmNewPassword}
            onChange={handleChange}
            fullWidth
          />
          <Box
            display={"flex"}
            sx={{ width: "100%" }}
            justifyContent={"flex-end"}
          >
            <Button
              onClick={handleChangePassword}
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                letterSpacing: 1,
                fontSize: 15,
              }}
              variant="outlined"
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Box>
      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.serverity}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
      />
    </>
  );
}

export default ChangePassword;
