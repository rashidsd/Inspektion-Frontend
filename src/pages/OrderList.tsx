import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ERPGrid from "../components/ERPGrid";
import { util } from "../util/index";
import { ColDef } from "ag-grid-community";
import ERPSnakBar from "../components/ERPSnakBar";
import useLocalStorage from "../hooks/useLocalStorage";
import OrderDetail from "../components/OrderDetail";
import { getClientForSelection } from "../services/clientService";
import {
  getAllOrdersWithDateRangeByClientId,
  findByOrderNoWithShiped,
} from "../services/orderService";
import { OrderMasterType } from "../customTypes/customTypes";

function OrderList() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    dayjs(new Date()).subtract(2, "month")
  );
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const gridRef = useRef<any>(null);
  const gridRef_detail = useRef<any>(null);
  const { user_type, client_id } = useLocalStorage();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [allOrders, setAllOrders] = useState([]);
  const [order, setOrder] = useState<any>({});
  const [pinnedRows, setPinnedRows] = useState<any[]>([]);

  const colDefs: ColDef[] = [
    {
      field: "order_no",
      headerName: "Order No",
      width: 130,
      filter: true,
      cellClass: "order-id",
      onCellClicked: (params) => {
        handleFindByOrderNo(params.value.toString());
      },
    },
    {
      field: "client_order_no",
      headerName: "Client Order No",
      filter: true,
      width: 150,
    },
    {
      field: "dated",
      headerName: "Order Date",
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) => dayjs(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "ship_date",
      headerName: "Shipment Date",
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) => dayjs(params.value).format("DD-MM-YYYY"),
    },
    {
      field: "client_name",
      headerName: "Client",
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      field: "vendor_name",
      headerName: "Vendor",
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      filter: true,
      field: "close",
      headerName: "Close",
      width: 100,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      minWidth: 120,
      flex: 1,
    },
  ];

  const colDefs_detail: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      hide: true,
    },
    {
      field: "art_no",
      headerName: "Article No",
      filter: true,
      width: 130,
    },
    {
      field: "art_name",
      headerName: "Article Name",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "color",
      headerName: "Color",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "size",
      headerName: "Size",
      width: 120,
      filter: true,
      sortable: true,
    },
    {
      field: "barcode",
      headerName: "Barcode",
      width: 140,
      filter: true,
      sortable: true,
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 110,
      filter: true,
      sortable: true,
    },
    {
      filter: true,
      field: "price",
      headerName: "Price",
      width: 100,
    },
    {
      filter: true,
      field: "total",
      headerName: "Total",
      width: 120,
    },
    {
      filter: true,
      field: "bal",
      headerName: "Balance",
      width: 130,
    },
    {
      filter: true,
      field: "bal_amount",
      headerName: "Balance Amount",
      width: 160,
    },
    {
      filter: true,
      field: "shiped",
      headerName: "Shipped",
      width: 130,
    },
    {
      filter: true,
      field: "shipped_amount",
      headerName: "Shipped Amount",
      minWidth: 170,
      flex: 1,
    },
  ];

  const handleAllOrder = async () => {
    try {
      if (user_type === "Admin" && !selectedClient) {
        setAlert({
          open: true,
          message: "Please select a client",
          serverity: "error",
        });
        return;
      }
      setLoading(true);
      const response: any = await getAllOrdersWithDateRangeByClientId(
        user_type === "Admin" ? selectedClient.client_id : client_id,
        dayjs(new Date()).subtract(12, "months").format("YYYY-MM-DD"),
        dayjs(new Date()).format("YYYY-MM-DD")
      );

      setAllOrders(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFindByOrderNo = async (order_no: string) => {
    try {
      const response: any = await findByOrderNoWithShiped(order_no);
      getTotalRowCount(response.data?.order_detail);
      setOrder(response.data);
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

  useEffect(() => {
    const getClients = async () => {
      try {
        const response: any = await getClientForSelection();
        setClients(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getClients();
  }, []);

  const getTotalRowCount = useCallback(
    (data: any[]) => {
      setPinnedRows([]);
      const totalRow = {
        barcode: "Totals",
        qty: data.reduce((acc, item) => acc + Number(item.qty), 0),
        total: Math.round(
          data.reduce((acc, item) => acc + Number(item.total), 0)
        ),
        bal: data.reduce((acc, item) => acc + Number(item.bal), 0),
        bal_amount: Math.round(
          data.reduce((acc, item) => acc + Number(item.bal_amount), 0)
        ),
        shiped: data.reduce((acc, item) => acc + Number(item.shiped), 0),
        shipped_amount: data.reduce(
          (acc, item) => acc + Number(item.shipped_amount),
          0
        ),
      };
      setPinnedRows([totalRow]);
    },
    [pinnedRows]
  );

  const onFilterChanged = useCallback(() => {
    if (!gridRef_detail.current) return;
    const visibleRows: any[] = [];
    gridRef_detail.current.forEachNodeAfterFilterAndSort((node: any) => {
      if (!node.group) {
        visibleRows.push(node.data);
      }
    });
    getTotalRowCount(visibleRows);
  }, [getTotalRowCount]);

  const onGridReady = (params: any) => {
    gridRef_detail.current = params.api;
  };

  return (
    <Box
      sx={
        {
          // width: {
          //   xs: `calc(100vw - ${util.erpGridMarginX}px)`,
          //   lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
          // },
        }
      }
    >
      <Box
        sx={{
          mt: 1,
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-start",
          gap: 1,
          border: "1px solid lightgray",
          width: {
            xs: "93vw",
            lg: `calc(95vw - ${util.sidebarWidth}px)`,
          },
          borderRadius: "4px",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From Date"
            format="DD-MM-YYYY"
            value={fromDate}
            onChange={(newValue) => {
              setFromDate(dayjs(newValue));
            }}
          />
          <DatePicker
            label="To Date"
            format="DD-MM-YYYY"
            value={toDate}
            onChange={(newValue) => {
              setToDate(dayjs(newValue));
            }}
          />
          <Autocomplete
            sx={{
              width: { xs: "100%", sm: 300 },
              display: user_type === "Admin" ? "block" : "none",
            }}
            options={clients}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params) => <TextField {...params} label="Client" />}
            value={selectedClient}
            onChange={(_, newValue) => {
              setSelectedClient(newValue);
            }}
          />
        </LocalizationProvider>
        <Button variant="outlined" color="primary" onClick={handleAllOrder}>
          Refresh
        </Button>
      </Box>
      <Box
        sx={{
          // width: {
          //   xs: `calc(100vw - ${util.erpGridMarginX}px)`,
          //   lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
          // },

          mt: 2,
          "& .order-id:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"35vh"}
          columnDefs={colDefs}
          rowData={allOrders}
          heading={"Order List"}
        />
        <Box sx={{ mt: 6, height: "400px", overflowY: "auto" }}>
          <ERPGrid
            ref={gridRef_detail}
            gridHeight={"35vh"}
            columnDefs={colDefs_detail}
            rowData={order?.order_detail}
            heading={"Order detail"}
            pinnedBottomRowData={pinnedRows}
            onGridReady={onGridReady}
            onFilterChanged={onFilterChanged}
            getRowStyle={(params: any) => {
              const totalRowBg =
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#d3d3d3";
              if (params.node?.rowPinned) {
                return { fontWeight: "bold", backgroundColor: totalRowBg };
              } else if (
                params.data?.account_title?.toString().includes("Total")
              ) {
                return { fontWeight: "bold", backgroundColor: totalRowBg };
              }
              return null;
            }}
          />
        </Box>
      </Box>

      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.serverity}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default OrderList;
