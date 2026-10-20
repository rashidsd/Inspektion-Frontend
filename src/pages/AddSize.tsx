import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { AgGridReact } from "ag-grid-react";
import { SizeType } from "../customTypes/customTypes";
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
  getAllSizes,
  updateSize,
  deleteSize,
  addSize,
} from "../services/sizeService";
import { TextField } from "@mui/material";
import { util } from "../util";

function AddSize() {
  const [sizes, setSizes] = useState<SizeType[] | null | undefined>([]);
  const [currentSize, setCurrentSize] = useState<SizeType | null>(null);
  const [openConfirmationUpdate, setOpenConfirmationUpdate] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [openNewSize, setOpenNewSize] = useState(false);
  const [newSize, setNewSize] = useState<SizeType>({
    id: "",
    size_name: "",
    category: "",
    descr: "",
  });

  const newColorName = useRef<HTMLInputElement>(null);

  const handleChangeSizeValue = (e: any) => {
    setNewSize({ ...newSize, [e.target.name]: e.target.value });
  };

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const gridRef = useRef<AgGridReact>(null);

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      cellClass: "hover-row",
    },
    {
      field: "size_name",
      headerName: "Size Name",
      editable: true,
      width: 180,
      filter: true,
    },
    {
      field: "category",
      headerName: "Category",
      editable: true,
      width: 150,
      filter: true,
    },
    {
      field: "sr_no",
      headerName: "Sr No",
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
            setCurrentSize(param.data);
            setOpenConfirmationDelete(true);
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  const allSizes = async () => {
    try {
      const response: any = await getAllSizes();
      setSizes(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    allSizes();
  }, []);

  const handleUpdate = async () => {
    try {
      setOpenConfirmationUpdate(false);
      const response: any = await updateSize(currentSize);
      if (response.status) {
        setAlert({
          open: true,
          message: "Size Updated Successfully",
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
      const response: any = await deleteSize(currentSize!.id);
      if (response.status) {
        setAlert({
          open: true,
          message: "Size Deleted Successfully",
          serverity: "success",
        });
        await allSizes();
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
      setCurrentSize(event.data);
      setOpenConfirmationUpdate(true);
    }
  };

  const handleOpenAddNewSize = () => {
    setOpenNewSize(true);
    setTimeout(() => {
      newColorName!.current!.focus();
    }, 100);
  };

  const handleAddSize = async () => {
    try {
      const response: any = await addSize(newSize);
      console.log(response, "color response");
      if (response.status) {
        setAlert({
          open: true,
          message: "Color Added Successfully",
          serverity: "success",
        });
        setOpenNewSize(false);
        setNewSize({
          id: "",
          size_name: "",
          category: "",
          descr: "",
        });
        await allSizes();
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
      <Button sx={{ mt: 2 }} onClick={handleOpenAddNewSize}>
        Add Size
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
          rowData={sizes}
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
        open={openNewSize}
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
              name="size_name"
              label="Size Name"
              value={newSize.size_name}
              onChange={handleChangeSizeValue}
              inputRef={newColorName}
            />
            <TextField
              name="category"
              label="Category"
              value={newSize.category}
              onChange={handleChangeSizeValue}
            />
            <TextField
              name="descr"
              label="Description"
              value={newSize.descr}
              onChange={handleChangeSizeValue}
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
                setOpenNewSize(false);
                setNewSize({
                  id: "",
                  size_name: "",
                  category: "",
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
              onClick={handleAddSize}
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

export default AddSize;
