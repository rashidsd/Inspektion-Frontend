import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import ERPGrid from "../../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import {
  CellEditingStoppedEvent,
  ColDef,
  CellEditingStartedEvent,
} from "ag-grid-community";
import { util } from "../../util";
import ERPSnakBar from "../../components/ERPSnakBar";
import Switch from "@mui/material/Switch";
import Backdrop from "@mui/material/Backdrop";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../services/settings/user_service";
import { UserType } from "../../customTypes/customTypes";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ManageUsers() {
  const gridRef = useRef<AgGridReact>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const userNameRef = useRef<HTMLInputElement>(null);
  const [currRecord, setCurrRecord] = useState<any>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [alert, setAlert] = useState<any>({
    open: false,
    message: "",
    severity: "info",
  });
  const [user, setUser] = useState<UserType>({
    id: "",
    user_name: "",
    email: "",
    password: "",
    confirm_password: "",
    active: true,
    user_type: "",
  });

  const colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sort: "asc",
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 170,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
    },
    {
      field: "user_type",
      headerName: "User Type",
      width: 120,
      editable: true,
    },
    {
      field: "client_id",
      headerName: "Client ID",
      width: 120,
      editable: true,
    },
    {
      field: "vendor_id",
      headerName: "Vendor_id",
      width: 120,
      editable: true,
    },
    {
      editable: false,
      field: "acitve",
      headerName: "Active",
      width: 100,

      cellRenderer: (params: any) => {
        return <Switch checked={params.data.active} size="small" />;
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      cellRenderer: (params: any) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                setCurrRecord(params.data);
                gridRef.current?.api.startEditingCell({
                  rowIndex: params.node.rowIndex,
                  colKey: "user_name",
                });
              }}
            >
              <Edit sx={{ fontSize: "22px" }} color="primary" />
            </IconButton>
            <IconButton
              onClick={() => {
                setCurrRecord(params.data);
                setOpenDeleteConfirmation(true);
              }}
            >
              <DeleteIcon sx={{ fontSize: "22px" }} color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    handleAllUsers();
  }, []);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleAllUsers = async () => {
    try {
      const response: any = await getAllUsers();
      if (response.status) {
        setAllUsers(response.data);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const handleChangeValue = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleNewUser = () => {
    setTimeout(() => {
      userNameRef.current?.focus();
    }, 100);
    setOpenForm(true);
    setUser({
      id: "",
      user_name: "",
      email: "",
      password: "",
      confirm_password: "",
      active: true,
      user_type: "",
    });
  };

  const isValid = () => {
    if (user.user_name === "") {
      setAlert({
        open: true,
        message: "User Name is required",
        severity: "error",
      });
      return false;
    }
    if (user.email === "" || emailRegex.test(user.email) === false) {
      setAlert({
        open: true,
        message: "Not a valid email address",
        severity: "error",
      });
      return false;
    }
    if (user.password === "") {
      setAlert({
        open: true,
        message: "Password is required",
        severity: "error",
      });
      return false;
    }
    if (user.user_type === "") {
      setAlert({
        open: true,
        message: "invalid user type",
        severity: "error",
      });
      return false;
    }
    if (user.confirm_password === "") {
      setAlert({
        open: true,
        message: "Confirm Password is required",
        severity: "error",
      });
      return false;
    }
    if (user.password !== user.confirm_password) {
      setAlert({
        open: true,
        message: "Password and Confirm Password do not match",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (isValid()) {
      try {
        const response: any = await createUser(user);

        if (response.status) {
          setAlert({
            open: true,
            message: response.msg,
            severity: "success",
          });
          handleAllUsers();
          setOpenForm(false);
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error.response
            ? error.response.data.msg
            : error.message.toString(),
          severity: "error",
        });
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response: any = await deleteUser(currRecord.id);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          severity: "success",
        });
        await handleAllUsers();
        setOpenDeleteConfirmation(false);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        severity: "error",
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response: any = await updateUser(currRecord);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          severity: "success",
        });
        //handleAllUsers();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        severity: "error",
      });
    }
  };

  const onCellEditingStarted = (event: CellEditingStartedEvent) => {
    setCurrRecord(event.data);
  };

  const onEditingStopped = async (event: CellEditingStoppedEvent) => {
    await handleUpdateUser();
  };

  return (
    <>
      <Box
        sx={{
          width: {
            xs: `calc(100vw - ${util.erpGridMarginX}px)`,
            lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
          },

          mt: 2,
          // "& .order-id:hover": {
          //   textDecoration: "underline",
          //   color: (theme) => theme.palette.primary.main,
          // },
          "& .ag-cell-inline-editing": {
            boxShadow: "none !Important",
            height: "auto !Important",
            padding: "2px !Important",
          },
        }}
      >
        <Button
          onClick={handleNewUser}
          sx={{
            mb: 2,
          }}
        >
          Create User
        </Button>
        <ERPGrid
          ref={gridRef}
          gridHeight={"70vh"}
          exportToExcel={true}
          columnDefs={colDefs}
          rowData={allUsers}
          onCellEditingStopped={onEditingStopped}
          onCellEditingStarted={onCellEditingStarted}
        />
      </Box>

      <Backdrop open={openForm}>
        <Paper elevation={2}>
          <Box
            width={430}
            height={490}
            bgcolor={"white"}
            sx={{ borderRadius: 4, p: 2 }}
          >
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              margin="normal"
              disabled
              value={user.id}
            />

            <TextField
              name="user_name"
              label="User Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={user.user_name}
              onChange={handleChangeValue}
              inputRef={userNameRef}
              error={user.user_name === "" ? true : false}
            />
            <Select
              name="user_type"
              value={user.user_type}
              onChange={handleChangeValue}
              fullWidth
            >
              <MenuItem value={"admin"}>Admin</MenuItem>
              <MenuItem value={"user"}>User</MenuItem>
              <MenuItem value={"client"}>Client</MenuItem>
              <MenuItem value={"vendor"}>Vendor</MenuItem>
            </Select>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={user.email}
              onChange={handleChangeValue}
              error={user.email === "" ? true : false}
            />
            <TextField
              name="password"
              label="Password"
              variant="outlined"
              fullWidth
              margin="dense"
              value={user.password}
              onChange={handleChangeValue}
              type="password"
              error={user.password === "" ? true : false}
            />
            <TextField
              name="confirm_password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="dense"
              value={user.confirm_password}
              onChange={handleChangeValue}
              type="password"
              error={user.confirm_password === "" ? true : false}
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={handleSave}
                variant="outlined"
                color="primary"
                sx={{ width: 100 }}
              >
                Save
              </Button>
              <Button
                onClick={() => setOpenForm(false)}
                variant="outlined"
                color="secondary"
                sx={{ width: 100 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Backdrop>
      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <ConfirmationDialog
        open={openDeleteConfirmation}
        title="Delete User"
        content="Sure you to delete this user?"
        onCancel={() => setOpenDeleteConfirmation(false)}
        onConfirm={handleDeleteUser}
        btnColor={"error"}
      />
    </>
  );
}

export default ManageUsers;
