import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { deleteBrand, updateClientBrand } from "../services/clientService";
import ConfirmationDialog from "./ConfirmationDialog";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import {
  BrandType,
  ClientVendorType,
  ContactType,
} from "../customTypes/customTypes";
import { stripedRowSx, tableHeaderRowSx } from "../util/tableStyles";

import ERPSnakBar from "./ERPSnakBar";

function BrandList({
  client,
  handleClient,
}: {
  client: ClientVendorType;
  handleClient: (obj: ClientVendorType) => void;
}) {
  const [openConfrimDlg, setOpenConfrimDlg] = useState(false);
  const [brand, setBrand] = useState<BrandType | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [tempData, setTempData] = useState<BrandType | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleDelete = async () => {
    if (!brand) return;

    setOpenConfrimDlg(false);
    if (!brand.id) {
      //delete on the bases of contact person
      const updatedBrands = client.brands?.filter((c) => c.name !== brand.name);
      handleClient({
        ...client,
        brands: updatedBrands,
      });
    } else {
      try {
        const response: any = await deleteBrand(brand.id);
        if (response.status) {
          const updatedContacts = client.contacts?.filter(
            (c) => c.id !== brand.id
          );
          handleClient({
            ...client,
            contacts: updatedContacts,
          });
          setAlert({
            open: true,
            message: "Contact deleted",
            serverity: "success",
          });
        }
      } catch (error) {
        setAlert({
          open: true,
          message: error.message.toString(),
          serverity: "error",
        });
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setTempData(client.brands![index]);
  };

  const handleEndEdit = async () => {
    try {
      setEditIndex(null);
      //remove the current contact from the list
      const updatedBrands = client.brands?.filter(
        (brand) => brand.id !== tempData?.id
      );
      //add the updated contact to the list
      handleClient({
        ...client,
        brands: [...updatedBrands!, tempData!],
      });
      const response: any = await updateClientBrand(tempData);
      if (response.status) {
        setAlert({
          open: true,
          message: "Contact updated",
          serverity: "success",
        });
      }
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const handleTempDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData({
      ...tempData!,
      [name]: value,
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="vendor contacts" size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowSx}>
              <TableCell sx={{ py: 1 }}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {client.brands
              ?.sort((a, b) => Number(a.id) - Number(b.id))
              .map((brand, index) => (
                <TableRow key={index} sx={stripedRowSx(index)}>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="id"
                        size="small"
                        value={tempData?.id}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      brand.id
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="name"
                        size="small"
                        value={tempData?.name}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      brand.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="descr"
                        size="small"
                        value={tempData?.descr}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      brand.descr
                    )}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="div"
                      display="flex"
                      justifyContent="flex-start"
                    >
                      {editIndex === index ? (
                        <IconButton onClick={handleEndEdit} size="small">
                          <DoneIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleEdit(index)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      )}

                      {}
                      <div>
                        {editIndex === index ? (
                          <IconButton
                            onClick={() => {
                              setEditIndex(null);
                              setTempData(null);
                            }}
                            size="small"
                            color={"error"}
                          >
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => {
                              setBrand(brand);
                              setOpenConfrimDlg(true);
                            }}
                            size="small"
                            color={"error"}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationDialog
        open={openConfrimDlg}
        title={"Deletion"}
        content={"sure to delete ?"}
        onCancel={setOpenConfrimDlg}
        onConfirm={handleDelete}
        btnColor={"error"}
      />
      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.serverity}
        onClose={() => setAlert({ serverity: "", message: "", open: false })}
      />
    </>
  );
}

export default BrandList;
