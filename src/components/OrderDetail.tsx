import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import {
  updateDetailRecord,
  deleteDetailRecord,
} from "../services/orderService";
import ConfirmationDialog from "./ConfirmationDialog";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import { OrderMasterType, OrderDetailType } from "../customTypes/customTypes";
import {
  getTableHeaderBg,
  stripedRowSx,
  tableHeaderRowSx,
} from "../util/tableStyles";

import ERPSnakBar from "./ERPSnakBar";

function OrderDetail({
  order,
  handleOrder,
  hideAction,
}: {
  order: OrderMasterType;
  handleOrder: (obj: OrderMasterType) => void;
  hideAction?: boolean;
}) {
  const [openConfrimDlg, setOpenConfrimDlg] = useState(false);
  const [orderDetail, setOrdeDetail] = useState<OrderDetailType | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [tempData, setTempData] = useState<OrderDetailType | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleDelete = async () => {
    if (!orderDetail) return;

    setOpenConfrimDlg(false);
    if (orderDetail.id == 0) {
     
      const updatedDetail = order.order_detail?.filter(
        (c) => c.id !== orderDetail.id
      );
      handleOrder({
        ...order,
        order_detail: updatedDetail,
      });
    } else {
      try {
        const response: any = await deleteDetailRecord(Number(orderDetail.id));
        if (response.status) {
          const updatedDetail = order.order_detail?.filter(
            (c) => c.id !== orderDetail.id
          );
          handleOrder({
            ...order,
            order_detail: updatedDetail,
          });
          setAlert({
            open: true,
            message: "record deleted",
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
    setTempData(order.order_detail![index]);
  };

  const handleEndEdit = async () => {
    try {
      setEditIndex(null);
      //remove the current contact from the list
      const updatedDetail = order.order_detail?.filter(
        (o) => o.id !== tempData?.id
      );
      //add the updated contact to the list
      handleOrder({
        ...order,
        order_detail: [...updatedDetail!, tempData!],
      });
      const response: any = await updateDetailRecord(tempData);
      if (response.status) {
        setAlert({
          open: true,
          message: "record updated",
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
      [name]: typeof value === "string" ? value : Number(value),
      total: name === "qty" ? Number(tempData!.price) * Number(value) : Number(tempData!.qty) * Number(value),
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="order detail" size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowSx}>
              <TableCell sx={{ py: 1 }}>Article No</TableCell>
              <TableCell>Article Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              {!hideAction && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {order.order_detail
              ?.sort((a, b) => Number(a.id) - Number(b.id))
              .map((ord, index) => (
                <TableRow key={index} sx={stripedRowSx(index)}>
                  <TableCell>{ord.art_no}</TableCell>
                  <TableCell>{ord.art_name}</TableCell>
                  <TableCell>{ord.color}</TableCell>
                  <TableCell>{ord.size}</TableCell>
                  <TableCell>{ord.barcode}</TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="qty"
                        size="small"
                        value={tempData?.qty}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      ord.qty
                    )}
                  </TableCell>
                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        name="price"
                        size="small"
                        value={tempData?.price}
                        onChange={handleTempDataChange}
                      />
                    ) : (
                      ord.price
                    )}
                  </TableCell>
                  <TableCell>{ord.total}</TableCell>

                  {!hideAction && (
                    <TableCell>
                      <Box
                        component="div"
                        display="flex"
                        justifyContent="flex-start"
                      >
                        {order.order_no && order.order_no.length > 0 && (
                          <div>
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
                          </div>
                        )}

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
                                setOrdeDetail(ord);
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
                  )}
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow
              sx={{
                backgroundColor: (theme) => getTableHeaderBg(theme),
                "&:last-child td, &:last-child th": {
                  border: 0,
                  fontWeight: 600,
                },
              }}
            >
              <TableCell colSpan={5} align="right">
                Total:
              </TableCell>
              <TableCell>
                {order.order_detail.reduce(
                  (acc: any, curr: any) => acc + curr.qty,
                  0
                )}
              </TableCell>
              <TableCell></TableCell>
              <TableCell colSpan={2}>
                {" "}
                {order.order_detail
                  .reduce((acc: any, curr: any) => acc + Number(curr.total), 0)
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
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

export default OrderDetail;
