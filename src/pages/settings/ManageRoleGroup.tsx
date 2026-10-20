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
import Backdrop from "@mui/material/Backdrop";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
  createRoleGroup,
  getAllRoleGroups,
  updateRoleGrop,
  deleteRoleGroup,
} from "../../services/settings/role_group_service";
import { RoleGropType } from "../../customTypes/customTypes";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

function ManageRoleGroup() {
  const gridRef = useRef<AgGridReact>(null);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const groupNameRef = useRef<HTMLInputElement>(null);
  const [currRecord, setCurrRecord] = useState<any>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [alert, setAlert] = useState<any>({
    open: false,
    message: "",
    severity: "info",
  });
  const [group, setGroup] = useState<RoleGropType>({
    id: "",
    group_name: "",
    descr: "",
  });

  const colDefs: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "group_name",
      headerName: "Group Name",
      width: 200,
      editable: true,
    },
    {
      field: "descr",
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
                  colKey: "group_name",
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

  const handleAllRecords = async () => {
    try {
      const response: any = await getAllRoleGroups();
      if (response.status) {
        setAllGroups(response.data);
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
    setGroup({
      ...group,
      [e.target.name]: e.target.value,
    });
  };
  const handleNew = () => {
    setTimeout(() => {
      groupNameRef.current?.focus();
    }, 100);
    setOpenForm(true);
    setGroup({
      id: "",
      group_name: "",
      descr: "",
    });
  };

  const isValid = () => {
    if (group.group_name === "") {
      setAlert({
        open: true,
        message: "Group Name is required",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isValid()) {
      try {
        const response: any = await createRoleGroup(group);

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
      const response: any = await deleteRoleGroup(currRecord.id);
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

  const handleUpdate = async (oldCellValue?: any) => {
    try {
      const response: any = await updateRoleGrop(currRecord);
      if (response.status) {
        setAlert({
          open: true,
          message: response.msg,
          severity: "success",
        });
        return;
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
    allGroups.forEach((record: any) => {
      if (record.id === currRecord.id) {
        record.group_name = oldCellValue;
      }
    });
    setAllGroups([...allGroups]);
  };
  const onEditingStart = (event: CellEditingStartedEvent) => {
    setCurrRecord(event.data);
  };

  const onEditingStopped = async (event: CellEditingStoppedEvent) => {
    await handleUpdate(event.oldValue);
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
          Create Role Group
        </Button>
        <ERPGrid
          ref={gridRef}
          gridHeight={"70vh"}
          exportToExcel={true}
          columnDefs={colDefs}
          rowData={allGroups}
          onCellEditingStopped={onEditingStopped}
          onCellEditingStarted={onEditingStart}
        />
      </Box>

      <Backdrop open={openForm} sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
        <Paper elevation={2}>
          <Box
            width={350}
            height={300}
            bgcolor={"white"}
            sx={{ borderRadius: 4, p: 3 }}
          >
            <TextField
              label="Group ID"
              variant="outlined"
              fullWidth
              margin="dense"
              disabled
              value={group.id}
            />
            <TextField
              name="group_name"
              label="Group Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={group.group_name}
              onChange={handleChangeValue}
              inputRef={groupNameRef}
              error={group.group_name === "" ? true : false}
            />
            <TextField
              name="descr"
              label="Description"
              variant="outlined"
              fullWidth
              margin="dense"
              value={group.descr}
              onChange={handleChangeValue}
              error={group.descr === "" ? true : false}
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

export default ManageRoleGroup;
