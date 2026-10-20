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
import { deleteContact, updateVendorContact } from "../services/vendorService";
import ConfirmationDialog from "./ConfirmationDialog";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import {
  ClientVendorType,
  ContactTypeVendor,
} from "../customTypes/customTypes";
import { stripedRowSx, tableHeaderRowSx } from "../util/tableStyles";

import ERPSnakBar from "./ERPSnakBar";

function ContactListVendor({
  vendor,
  handleVendor,
}: {
  vendor: ClientVendorType;
  handleVendor: (obj: ClientVendorType) => void;
}) {
  const [openConfrimDlg, setOpenConfrimDlg] = useState(false);
  const [contact, setContact] = useState<ContactTypeVendor | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [tempData, setTempData] = useState<ContactTypeVendor | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleDelete = async () => {
    if (!contact) return;

    setOpenConfrimDlg(false);
    if (!contact.id) {
      //delete on the bases of contact person
      const updatedContacts = vendor.contacts?.filter(
        (c) => c.contact_person !== contact.contact_person
      );
      handleVendor({
        ...vendor,
        contacts: updatedContacts,
      });
    } else {
      try {
        const response: any = await deleteContact(Number(contact.id));
        if (response.status) {
          const updatedContacts = vendor.contacts?.filter(
            (c) => c.id !== contact.id
          );
          handleVendor({
            ...vendor,
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
    setTempData(vendor.contacts![index]);
  };

  const handleEndEdit = async () => {
    try {
      setEditIndex(null);
      //remove the current contact from the list
      const updatedContacts = vendor.contacts?.filter(
        (contact) => contact.id !== tempData?.id
      );
      //add the updated contact to the list
      handleVendor({
        ...vendor,
        contacts: [...updatedContacts!, tempData!],
      });
      const response: any = await updateVendorContact(tempData);
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
              <TableCell sx={{ py: 1 }}>Contact Person</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendor.contacts
              ?.sort((a, b) => Number(a.id) - Number(b.id))
              .map((contact, index) => (
                <TableRow key={index} sx={stripedRowSx(index, true)}>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="contact_person"
                        size="small"
                        value={tempData?.contact_person}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      contact.contact_person
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="designation"
                        size="small"
                        value={tempData?.designation}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      contact.designation
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="contact_no"
                        size="small"
                        value={tempData?.contact_no}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      contact.contact_no
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="email"
                        size="small"
                        value={tempData?.email}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      contact.email
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
                              setContact(contact);
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

export default ContactListVendor;
