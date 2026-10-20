import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { AgGridReact } from "ag-grid-react";
import { InspectorType } from "../customTypes/customTypes";
import { useEffect, useRef, useState } from "react";
import ERPSnakBar from "../components/ERPSnakBar";
import ERPGrid from "../components/ERPGrid";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { FormControlLabel, Switch } from "@mui/material";
import {
  ColDef,
  GetRowIdParams,
  CellEditingStoppedEvent,
} from "ag-grid-community";
import {
  createInspector,
  deleteInspector,
  getAllInspectors,
  updateInspector,
  getInspectorById,
} from "../services/inspectorService";
import { TextField } from "@mui/material";
import { util } from "../util";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function AddInspector() {
  const [list, setList] = useState<InspectorType[] | null | undefined>([]);
  const [currentInspector, setCurrInspector] = useState<InspectorType | null>(
    null
  );
  const [openConfirmationUpdate, setOpenConfirmationUpdate] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [newInspector, setNewInspector] = useState<InspectorType>({
    id: "",
    name: "",
    mobile: "",
    address: "",
    active: true,
  });

  const newName = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    setNewInspector({
      ...newInspector,
      [e.target.name]:
        e.target.name == "active" ? e.target.checked : e.target.value,
    });
  };

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const gridRef = useRef<AgGridReact>(null);

  var editInspector: InspectorType = {
    id: "",
    name: "",
    address: "",
    mobile: "",
    active: true,
  };

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      cellClass: "hover-row",
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
      width: 180,
      filter: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",

      width: 150,
      filter: true,
    },
    {
      field: "address",
      headerName: "Address",
      filter: true,
      width: 240,
    },
    {
      field: "active",
      headerName: "Active",
      width: 120,
      filter: true,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      cellRenderer: (param: any) => (
        <>
          <IconButton
            onClick={() => {
              setOpenNew(true);
              setNewInspector(param.data);
            }}
          >
            <ModeEditIcon color="primary" />
          </IconButton>
          <IconButton
            onClick={() => {
              setCurrInspector(param.data);
              setOpenConfirmationDelete(true);
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  const allInspectors = async () => {
    try {
      const response: any = await getAllInspectors();
      setList(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    allInspectors();
  }, []);

  const handleDelete = async () => {
    try {
      setOpenConfirmationDelete(false);
      const response: any = await deleteInspector(currentInspector!.id);
      if (response.status) {
        setAlert({
          open: true,
          message: "Inspector Deleted Successfully",
          serverity: "success",
        });
        await allInspectors();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const handleOpenAddNew = () => {
    setOpenNew(true);
    setTimeout(() => {
      newName!.current!.focus();
    }, 100);
  };

  const handleAddInspector = async () => {
    try {
      const response: any = newInspector.id
        ? await updateInspector(newInspector)
        : await createInspector(newInspector);

      console.log(response, "response.data);  ");
      if (response.status) {
        setAlert({
          open: true,
          message: response.message,
          serverity: "success",
        });
        setOpenNew(false);
        setNewInspector({
          id: "",
          name: "",
          mobile: "",
          address: "",
          active: true,
        });
        await allInspectors();
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  return (
    <>
      <Button
        sx={{
          mt: 2,
        }}
        onClick={handleOpenAddNew}
        variant="outlined"
      >
        Add Inspector
      </Button>
      <Box
        sx={{
          width: {
            xs: `calc(100vw - ${util.erpGridMarginX}px)`,
            lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
          },

          mt: 2,
          "& .hover-row:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
          "& .ag-cell-inline-editing": {
            boxShadow: "none !Important",
            height: "auto !Important",
            padding: "2px !Important",
          },
          // "& .ag-cell-focus": {
          //   border: "none !Important",
          // },
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"70vh"}
          rowData={list}
          columnDefs={columns}
          getRowId={(param: GetRowIdParams) => param.data.id}
        />
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />

      <ConfirmationDialog
        open={openConfirmationDelete}
        onCancel={setOpenConfirmationDelete}
        onConfirm={handleDelete}
        btnColor={"error"}
      />
      <Backdrop
        open={openNew}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Paper
          elevation={2}
          sx={{
            py: 3,
            px: 3,
            display: "flex",
            flexDirection: "column",
            width: 400,
            gap: 1,
          }}
        >
          <Box
            component={"div"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <TextField
              id="id"
              label="ID"
              value={newInspector.id}
              onChange={handleChange}
            />
            <TextField
              name="name"
              label="Inspector Name"
              value={newInspector.name}
              onChange={handleChange}
              inputRef={newName}
            />
            <TextField
              name="mobile"
              label="Mobile"
              value={newInspector.mobile}
              onChange={handleChange}
            />
            <TextField
              name="address"
              label="Address"
              value={newInspector.address}
              onChange={handleChange}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={newInspector.active}
                onChange={handleChange}
                name="active"
                color="primary"
              />
            }
            label="Active"
          />

          <Box
            component={"div"}
            display={"flex"}
            justifyContent={"flex-end"}
            gap={2}
          >
            <Button
              onClick={handleAddInspector}
              sx={{ width: 80 }}
              variant="outlined"
              color="success"
            >
              {newInspector.id ? "Update" : "Add"}
            </Button>
            <Button
              onClick={() => {
                setOpenNew(false);
                setNewInspector({
                  id: "",
                  name: "",
                  mobile: "",
                  address: "",
                  active: true,
                });
              }}
              variant="outlined"
              color="error"
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Backdrop>
    </>
  );
}

export default AddInspector;
