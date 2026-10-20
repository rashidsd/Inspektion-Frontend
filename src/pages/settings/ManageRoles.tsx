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
import Autocomplete from "@mui/material/Autocomplete";
import Backdrop from "@mui/material/Backdrop";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
  createRole,
  updateRole,
  deleteRole,
  getAllRoles,
} from "../../services/settings/role_service";
import { getRoleGroupsForSelection } from "../../services/settings/role_group_service";
import { RoleType } from "../../customTypes/customTypes";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

function ManageRoles() {
  const gridRef = useRef<AgGridReact>(null);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const groupRef = useRef<HTMLInputElement>(null);
  const [currRecord, setCurrRecord] = useState<any>(null);
  const [roleGroups, setRoleGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [alert, setAlert] = useState<any>({
    open: false,
    message: "",
    severity: "info",
  });
  const [role, setRole] = useState<RoleType>({
    id: "",
    role_name: "",
    group_id: "",
    descr: "",
  });

  const colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      sort: "asc",
    },
    {
      field: "role_name",
      headerName: "Role",
      width: 200,
      editable: true,
    },
    {
      field: "group_name",
      headerName: "Group",
      width: 200,
      editable: true,
    },
    {
      field: "descr",
      editable: true,
      headerName: "Description",
      width: 200,
    },

    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      cellRenderer: (params: any) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                setCurrRecord(params.data);
                gridRef.current?.api.startEditingCell({
                  rowIndex: params.node.rowIndex,
                  colKey: "role_name",
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
    handleAllRecords();
  }, []);

  useEffect(() => {
    const getRoleGroups = async () => {
      try {
        const response: any = await getRoleGroupsForSelection();
        if (response.status) {
          setRoleGroups(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getRoleGroups();
  }, []);

  const handleAllRecords = async () => {
    try {
      const response: any = await getAllRoles();
      if (response.status) {
        setAllRoles(response.data);
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
    setRole({
      ...role,
      [e.target.name]: e.target.value,
    });
  };
  const handleNew = () => {
    setTimeout(() => {
      groupRef.current?.focus();
    }, 100);
    setOpenForm(true);
    setRole({
      id: "",
      role_name: "",
      group_id: "",
      descr: "",
    });
    setSelectedGroup(null);
  };

  const isValid = () => {
    if (role.role_name === "") {
      setAlert({
        open: true,
        message: "Role Name is required",
        severity: "error",
      });
      return false;
    } else if (role.group_id === "") {
      setAlert({
        open: true,
        message: "Group is required",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (isValid()) {
      try {
        const response: any = await createRole(role);

        if (response.status) {
          setAlert({
            open: true,
            message: response.msg,
            severity: "success",
          });
          handleAllRecords();
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

  const handleDeleteRecord = async () => {
    try {
      const response: any = await deleteRole(currRecord.id);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          severity: "success",
        });
        await handleAllRecords();
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

  const handleUpdate = async () => {
    try {
      const response: any = await updateRole(currRecord);
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

  const onEditingStarted = async (event: CellEditingStartedEvent) => {
    setCurrRecord(event.data);
  };

  const onEditingStopped = async (event: CellEditingStoppedEvent) => {
    await handleUpdate();
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
          onClick={handleNew}
          sx={{
            mb: 2,
          }}
        >
          Create Role
        </Button>
        <ERPGrid
          ref={gridRef}
          gridHeight={"70vh"}
          exportToExcel={true}
          columnDefs={colDefs}
          rowData={allRoles}
          onCellEditingStopped={onEditingStopped}
          onCellEditingStarted={onEditingStarted}
        />
      </Box>

      <Backdrop open={openForm} sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
        <Paper elevation={2}>
          <Box
            width={370}
            height={370}
            bgcolor={"white"}
            sx={{ borderRadius: 4, p: 3 }}
          >
            <TextField
              label="Role ID"
              variant="outlined"
              fullWidth
              margin="dense"
              disabled
              value={role.id}
            />
            <Autocomplete
              options={roleGroups}
              getOptionLabel={(option) => option.group_name}
              value={selectedGroup}
              onChange={(e, value) => {
                setSelectedGroup(value);
                setRole({
                  ...role,
                  group_id: value.id,
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Group"
                  margin="dense"
                  error={role.group_id === "" ? true : false}
                  inputRef={groupRef}
                />
              )}
            />
            <TextField
              name="role_name"
              label="Role Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={role.role_name}
              onChange={handleChangeValue}
              error={role.role_name === "" ? true : false}
            />
            <TextField
              name="descr"
              label="Description"
              variant="outlined"
              fullWidth
              margin="dense"
              value={role.descr}
              onChange={handleChangeValue}
              error={role.descr === "" ? true : false}
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
        title="Delete Group"
        content="Sure you to delete this group?"
        onCancel={() => setOpenDeleteConfirmation(false)}
        onConfirm={handleDeleteRecord}
        btnColor={"error"}
      />
    </>
  );
}

export default ManageRoles;
