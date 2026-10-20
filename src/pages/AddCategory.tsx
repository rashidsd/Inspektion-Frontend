import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { AgGridReact } from "ag-grid-react";
import { CategoryType } from "../customTypes/customTypes";
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
  getAllCategories,
  updateCategory,
  deleteCategory,
  addCategory,
} from "../services/categoryService";
import { TextField } from "@mui/material";
import { util } from "../util";

function AddCategory() {
  const [categories, setCategories] = useState<
    CategoryType[] | null | undefined
  >([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(
    null
  );
  const [openConfirmationUpdate, setOpenConfirmationUpdate] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryType>({
    id: "",
    name: "",
    descr: "",
  });

  const newColorName = useRef<HTMLInputElement>(null);

  const handleChangeCategoryValue = (e: any) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const gridRef = useRef<AgGridReact>(null);

  var editColor: CategoryType = {
    id: "",
    name: "",
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
      field: "name",
      headerName: "Category",
      editable: true,
      width: 180,
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
            setCurrentCategory(param.data);
            setOpenConfirmationDelete(true);
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  const allCategories = async () => {
    try {
      const response: any = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    allCategories();
  }, []);

  const handleUpdate = async () => {
    try {
      setOpenConfirmationUpdate(false);
      const response: any = await updateCategory(currentCategory);
      if (response.status) {
        setAlert({
          open: true,
          message: "Category Updated Successfully",
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
      const response: any = await deleteCategory(currentCategory!.id);
      if (response.status) {
        setAlert({
          open: true,
          message: "Category Deleted Successfully",
          serverity: "success",
        });
        await allCategories();
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
      setCurrentCategory(event.data);
      setOpenConfirmationUpdate(true);
    }
  };

  const handleOpenAddNewCategory = () => {
    setOpenNewCategory(true);
    setTimeout(() => {
      newColorName!.current!.focus();
    }, 100);
  };

  const handleAddCategory = async () => {
    try {
      const response: any = await addCategory(newCategory);
      if (response.status) {
        setAlert({
          open: true,
          message: "Color Added Successfully",
          serverity: "success",
        });
        setOpenNewCategory(false);
        setNewCategory({
          id: "",
          name: "",
          descr: "",
        });
        await allCategories();
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
        onClick={handleOpenAddNewCategory}
      >
        Add Category
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
          rowData={categories}
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
        open={openNewCategory}
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
              name="name"
              label="Category"
              value={newCategory.name}
              onChange={handleChangeCategoryValue}
              inputRef={newColorName}
            />
            <TextField
              name="descr"
              label="Description"
              value={newCategory.descr}
              onChange={handleChangeCategoryValue}
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
                setOpenNewCategory(false);
                setNewCategory({
                  id: "",
                  name: "",
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
              onClick={handleAddCategory}
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

export default AddCategory;
