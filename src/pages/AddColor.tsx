import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { AgGridReact } from "ag-grid-react";
import { ColoryType } from "../customTypes/customTypes";
import { useEffect, useRef, useState } from "react";
import ERPSnakBar from "../components/ERPSnakBar";
import ERPGrid from "../components/ERPGrid";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {
  ColDef,
  GetRowIdParams,
  CellEditingStoppedEvent,
} from "ag-grid-community";
import {
  getAllColors,
  updateColor,
  deleteColor,
  addColor,
} from "../services/colorService";
import { TextField } from "@mui/material";
import { util } from "../util";

function AddColor() {
  const [colors, setColors] = useState<ColoryType[] | null | undefined>([]);
  const [currentColor, setCurrentColor] = useState<ColoryType | null>(null);
  const [openConfirmationUpdate, setOpenConfirmationUpdate] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [openNewColor, setOpenNewColor] = useState(false);
  const [newColor, setNewColor] = useState<ColoryType>({
    id: "",
    color_name: "",
    code: "",
    descr: "",
  });

  const newColorName = useRef<HTMLInputElement>(null);

  const handleChangeColorValue = (e: any) => {
    setNewColor({ ...newColor, [e.target.name]: e.target.value });
  };

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const gridRef = useRef<AgGridReact>(null);

  var editColor: ColoryType = {
    id: "",
    color_name: "",
    code: "",
    descr: "",
  };

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      cellClass: "hover-row",
    },
    {
      field: "color_name",
      headerName: "Color Name",
      editable: true,
      width: 180,
      filter: true,
    },
    {
      field: "code",
      headerName: "Code",
      editable: true,
      width: 150,
      filter: true,
    },
    {
      field: "descr",
      headerName: "Description",
      editable: true,
      filter: true,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 120,
      flex: 1,
      cellRenderer: (param: any) => (
        <IconButton
          onClick={() => {
            setCurrentColor(param.data);
            setOpenConfirmationDelete(true);
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  const allColors = async () => {
    try {
      const response: any = await getAllColors();
      setColors(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    allColors();
  }, []);

  const handleUpdate = async () => {
    try {
      setOpenConfirmationUpdate(false);
      const response: any = await updateColor(currentColor);
      if (response.status) {
        setAlert({
          open: true,
          message: "Color Updated Successfully",
          serverity: "success",
        });
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

  const handleDelete = async () => {
    try {
      setOpenConfirmationDelete(false);
      const response: any = await deleteColor(currentColor!.id);
      if (response.status) {
        setAlert({
          open: true,
          message: "Color Deleted Successfully",
          serverity: "success",
        });
        await allColors();
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

  const onCellEditingStopped = async (event: CellEditingStoppedEvent) => {
    if (event.value === "" || event.value === null) {
      setAlert({
        open: true,
        message: "Please fill the required field",
        serverity: "error",
      });
      return;
    } else {
      setCurrentColor(event.data);
      setOpenConfirmationUpdate(true);
    }
  };

  const handleOpenAddNewColor = () => {
    setOpenNewColor(true);
    setTimeout(() => {
      newColorName!.current!.focus();
    }, 100);
  };

  const handleAddColor = async () => {
    try {
      const response: any = await addColor(newColor);
      console.log(response, "color response");
      if (response.status) {
        setAlert({
          open: true,
          message: "Color Added Successfully",
          serverity: "success",
        });
        setOpenNewColor(false);
        setNewColor({
          id: "",
          color_name: "",
          code: "",
          descr: "",
        });
        await allColors();
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
        onClick={handleOpenAddNewColor}
      >
        Add Color
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
          rowData={colors}
          columnDefs={columns}
          exportToExcel={true}
          getRowId={(param: GetRowIdParams) => param.data.id}
          onCellEditingStopped={onCellEditingStopped}
        />
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />
      <ConfirmationDialog
        title="Updation"
        content="sure to update?"
        open={openConfirmationUpdate}
        onCancel={setOpenConfirmationUpdate}
        onConfirm={handleUpdate}
      />
      <ConfirmationDialog
        open={openConfirmationDelete}
        onCancel={setOpenConfirmationDelete}
        onConfirm={handleDelete}
        btnColor={"error"}
      />
      <Backdrop
        open={openNewColor}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Paper
          elevation={2}
          sx={{
            py: 3,
            px: 3,
            display: "flex",
            flexDirection: "column",
            width: 320,
            gap: 2,
          }}
        >
          <Box
            component={"div"}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <TextField
              name="color_name"
              label="Color Name"
              value={newColor.color_name}
              onChange={handleChangeColorValue}
              inputRef={newColorName}
            />
            <TextField
              name="code"
              label="Code"
              value={newColor.code}
              onChange={handleChangeColorValue}
            />
            <TextField
              name="descr"
              label="Description"
              value={newColor.descr}
              onChange={handleChangeColorValue}
            />
          </Box>
          <Box
            component={"div"}
            display={"flex"}
            justifyContent={"flex-end"}
            gap={2}
          >
            <Button
              onClick={() => {
                setOpenNewColor(false);
                setNewColor({
                  id: "",
                  color_name: "",
                  code: "",
                  descr: "",
                });
              }}
              variant="outlined"
              color="error"
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddColor}
              sx={{ width: 80 }}
              variant="outlined"
              color="primary"
            >
              Add
            </Button>
          </Box>
        </Paper>
      </Backdrop>
    </>
  );
}

export default AddColor;
