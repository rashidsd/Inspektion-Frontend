import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import { updateOrderStatus } from "../services/orderService";
import ERPSnakBar from "../components/ERPSnakBar";
function OpenCloseOrder({
  orderNo,
  orderStatus,
}: {
  orderNo: string;
  orderStatus: boolean;
}) {
  const [checked, setChecked] = useState(orderStatus ? true : false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const handleOrderStatus = async () => {
    try {
      const result: any = await updateOrderStatus(orderNo, checked);
      if (result.status) {
        setAlert({
          open: true,
          message: `Order No: ${orderNo} status updated successfully`,
          serverity: "success",
        });
      } else {
        setAlert({
          open: true,
          message: `Failed to update order status`,
          serverity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Error updating order status`,
        serverity: "error",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,

          height: "100%",
        }}
      >
        <Switch
          size="small"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        />
        <IconButton
          size="small"
          onClick={handleOrderStatus}
          color="success"
          sx={{ padding: 0 }}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ position: "absolute", top: 300, left: 0 }}>
        <ERPSnakBar
          open={alert.open}
          message={alert.message}
          serverity={alert.serverity}
          onClose={() =>
            setAlert({
              ...alert,
              open: false,
            })
          }
        />
      </Box>
    </>
  );
}

export default OpenCloseOrder;
