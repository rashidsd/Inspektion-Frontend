import { useState, useEffect, useRef, ChangeEventHandler } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getClientForSelection } from "../services/clientService";
import { getVendorForSelection } from "../services/vendorService";
import { util } from "../util";
import { getArticlesForOrderSelection } from "../services/articleService";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import OrderDetail from "../components/OrderDetail";
import { OrderDetailType, OrderMasterType } from "../customTypes/customTypes";
import ERPSnakBar from "../components/ERPSnakBar";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import ConfirmationDialog from "../components/ConfirmationDialog";

import ERPGridWithDateRange from "../components/ERPGridWithDateRange";
import { ColDef } from "ag-grid-community";
import {
  createOrder,
  getAllOrders,
  findByOrderNo,
  updateOrder,
  uploadOrder,
  getAllOrdersWithDateRange,
  deleteRecord
} from "../services/orderService";

import InputFileUpload from "../components/InputFileUpload";
import * as XLSX from "xlsx";
import OpenCloseOrder from "../components/OpenCloseOrder";
import { set } from "lodash";
import { Delete } from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return value === index && <Box {...other}>{children}</Box>;
}

function AddOrder() {
  const [value, setValue] = useState(0);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [allOrders, setAllOrders] = useState([]);
  const orderDateRef = useRef<HTMLInputElement | null>(null);
  const [uploadingOrder, setUploadingOrder] = useState(false);
  const [notFoundArticles, setNotFoundArticles] = useState<string[]>([]);
  const [openConfrimDlg, setOpenConfrimDlg] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const uploadRef = useRef<any>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const [addRecord, setAddRecord] = useState<OrderDetailType>({
    id: 0,
    order_no: "",
    article_id: "",
    art_no: "",
    art_name: "",
    color: "",
    size: "",
    barcode: "",
    qty: 0,
    price: 0,
    total: 0,
  });
  const [order, setOrder] = useState<OrderMasterType>({
    order_no: "",
    dated: "",
    ship_date: "",
    client_id: "",
    vendor_id: "",
    client_order_no: "",
    vendor_order_no: "",
    remarks: "",
    ship_type: "",
    ship_country: "",
    ship_address: "",
    reference: "",
    order_detail: [],
  });

  const colDefs: ColDef[] = [
    {
      field: "order_no",
      headerName: "Order No",
      width: 130,
      filter: true,
      cellClass: "order-id",
      onCellClicked: (params) => {
        handleFindByOrderNo(params.value.toString());
        setValue(0);
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
      field: "close",
      headerName: "Close",
      width: 100,

      cellRenderer: (params: any) => {
        return (
          <OpenCloseOrder
            orderNo={params.data.order_no}
            orderStatus={params.value}
          />
        );
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      minWidth: 120,
      flex: 1,
    },
  ];

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

  useEffect(() => {
    const getVendors = async () => {
      try {
        const response: any = await getVendorForSelection();
        setVendors(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getVendors();
  }, []);

  useEffect(() => {
    handleAllOrder();
  }, []);

  const handleChangeClient = async (event: any, value: any) => {
    try {
      const response: any = await getArticlesForOrderSelection(value.id);
      setSelectedClient(value);
      setOrder({ ...order, ["client_id"]: value.id });
      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeVendor = (event: any, value: any) => {
    setSelectedVendor(value);
    setOrder({ ...order, ["vendor_id"]: value.id });
  };

  const handleChangeArticle = (event: any, value: any) => {
    setSelectedArticle(value);
    setAddRecord((prv) => ({ ...prv, ...value }));
  };

  const handTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleOrderValueChange = (name: string, value: string | undefined) => {
    setOrder({
      ...order,
      [name]: value,
    });
  };

  const handleAddRecord = () => {
    const found = order.order_detail?.find(
      (r) => r.article_id === addRecord.article_id
    );
    if (found) {
      setAlert({
        open: true,
        message: "Article already added",
        serverity: "error",
      });
      return;
    }
    setAddRecord({ ...addRecord, ["order_no"]: order.order_no });
    setOrder({
      ...order,
      ["order_detail"]: [...order.order_detail!, addRecord],
    });
  };

  

  const handleNewRecord = () => {
    setOrder({
      order_no: "",
      dated: dayjs(new Date()).format("YYYY-MM-DD"),
      ship_date: dayjs(new Date().setMonth(1)).format("YYYY-MM-DD"),
      client_id: "",
      vendor_id: "",
      client_order_no: "",
      vendor_order_no: "",
      remarks: "",
      ship_type: "",
      ship_country: "",
      ship_address: "",
      reference: "",
      order_detail: [],
    });
    setAddRecord({
      id: 0,
      order_no: "",
      article_id: "",
      art_no: "",
      art_name: "",
      color: "",
      size: "",
      qty: 0,
      price: 0,
      total: 0,
      barcode: "",
    });
    setSelectedClient(null);
    setSelectedVendor(null);
    setSelectedArticle(null);
    setNotFoundArticles([]);

    orderDateRef!.current!.focus();
  };

  const isValidOrder = () => {
    if (
      order.dated == "" ||
      order.client_id == "" ||
      order.vendor_id == "" ||
      order.ship_date == "" ||
      order.ship_type == "" ||
      order.client_order_no == "" ||
      order.ship_country == "" ||
      order.ship_address == ""
    ) {
      setAlert({
        open: true,
        message: "Please fill all required fields",
        serverity: "error",
      });
      return false;
    }
    return true;
  };

  const handleSaveRecord = async () => {
    if (!isValidOrder()) return;
   
    try {
      order.order_detail.forEach((o: any) => {
        if (o.id === 0) delete o.id;
      });

      const response: any =
        order.order_no == "" || order.order_no == null
          ? await createOrder(order)
          : await updateOrder(order);
      setAlert({
        open: true,
        message:
          order.order_no == "" || order.order_no == null
            ? "record saved"
            : "record updated",
        serverity: "success",
      });
     
      await handleFindByOrderNo(response.data.order_no);
      await handleAllOrder();
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

  const handleAllOrder = async () => {
    try {
      const response: any = await getAllOrdersWithDateRange(
        dayjs(new Date()).subtract(18, "months").format("YYYY-MM-DD"),
        dayjs(new Date()).format("YYYY-MM-DD")
      );
      // setValue(1);
      setAllOrders(response.data);
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

  const handleFindByOrderNo = async (order_no: string) => {
    try {
      const response: any = await findByOrderNo(order_no);

      setOrder(response.data);
      setSelectedClient({
        id: response.data.client_id,
        name: response.data.client_name,
      });
      setSelectedVendor({
        id: response.data.vendor_id,
        name: response.data.vendor_name,
      });
      await getArticlesForOrderSelection(response.data.client_id);
      setNotFoundArticles([]);
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

  const handleFileChange = (e: any) => {
    try {
      if (!isValidOrder()) {
        setAlert({
          open: true,
          message: "Please fill all required fields",
          serverity: "error",
        });
        e.target.value = null;
        return;
      }

      setUploadingOrder(true);
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (evt: any) => {
          const fileData = evt.target.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const detailRecord = workbook.Sheets[workbook.SheetNames[0]];
          const detail = XLSX.utils
            .sheet_to_json(detailRecord)
            .filter(
              (r: any) =>
                r.Sku.toString().trim() != "" &&
                r.Qty.toString().trim() != "" &&
                r.Price.toString().trim() != ""
            );
          console.log(detail, "Excel Data");
          setNotFoundArticles([]);
          const orderDetail = detail.map((d: any) => {
            const { article_id, art_no, art_name, color, size } =
              getArticleInfo(d.Sku);
            return {
              id: -1,
              order_no: "",
              art_no: art_no,
              article_id: article_id,
              art_name: art_name,
              color: color,
              size: size,
              barcode: d.Sku,
              qty: d.Qty,
              price: d.Price,
              total: Number(d.Qty) * Number(d.Price),
            };
          });

          // setOrder({ ...master, order_detail: response.data.found });
          // setNotFoundArticles(response.data.notFound);
          setUploadingOrder(false);
          // console.log(orderDetail, "Detail Record");
          // console.log(notFoundArticles, "Not Found Articles");
          setOrder({
            ...order,
            order_detail: orderDetail,
          });
          evt.target.value = null;
          uploadRef.current!.value = null;
          console.log(order, "Order");
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      setUploadingOrder(false);
      console.log(error);
    }
  };
  const getArticleInfo = (barcode: string) => {
    const found: any = articles.find((a: any) => a.barcode == barcode);
    if (found) {
      return found;
    } else {
      setNotFoundArticles((prv) => [...prv, barcode]);
      return { article_id: "", art_no: "", art_name: "", color: "", size: "" };
    }
  };

  const handleDeleteConfirmation = ()=> {
     if (order.order_no == "" || order.order_no == null) {
    setAlert({
      open: true,
      message: "Please select an order to delete",
      serverity: "error",
    });
    return;
  } 
    setOpenConfrimDlg(true);
  }

    const handleDeleteRecord = async () => {

try {  
 
  const response: any =  await deleteRecord(order.order_no || "");
  if (response.status) {
    setOpenConfrimDlg(false);
    setAlert({
      open: true,
      message: "Record deleted successfully",
      serverity: "success",
    });
    handleNewRecord();
    handleAllOrder();
  } else {
    setAlert({
      open: true,
      message: response.msg || "Failed to delete record",
      serverity: "error",
    });
  }
  
}catch (error) {
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" color="primary">
        Manage Orders
      </Typography>

      <Tabs value={value} onChange={handTabChange}>
        <Tab label="Add Order" value={0} />
        <Tab label="Order's List" value={1} />
      </Tabs>
      <TabPanel value={value} index={0} key={0}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              width: { xs: "93vw", lg: `calc(95vw - ${util.sidebarWidth}px)` },
              p: 2,
              my: 1,

              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mb: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleNewRecord}
                sx={{ mb: 1, mr: 1 }}
              >
                New Order
              </Button>
            </Box>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="order_no"
                  label="Order No"
                  fullWidth
                  disabled
                  value={order.order_no}
                ></TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DatePicker
                  label="Order Date"
                  format="DD-MM-YYYY"
                  inputRef={orderDateRef}
                  sx={{
                    width: "100%",
                  }}
                  value={dayjs(order.dated)}
                  onChange={(date) => {
                    handleOrderValueChange("dated", date?.format("YYYY-MM-DD"));
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Autocomplete
                  disabled={order.order_detail?.length > 0}
                  options={clients}
                  getOptionLabel={(option: any) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Client"
                      error={selectedClient == null}
                    />
                  )}
                  value={selectedClient}
                  onChange={handleChangeClient}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DatePicker
                  label="Shipment Date"
                  format="DD-MM-YYYY"
                  sx={{
                    width: "100%",
                  }}
                  value={dayjs(order.ship_date)}
                  onChange={(date) => {
                    handleOrderValueChange(
                      "ship_date",
                      date?.format("YYYY-MM-DD")
                    );
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Autocomplete
                  options={vendors}
                  getOptionLabel={(option: any) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendor"
                      error={selectedVendor == null}
                    />
                  )}
                  value={selectedVendor}
                  onChange={handleChangeVendor}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="client_order_no"
                  label="Client Order No"
                  fullWidth
                  value={order.client_order_no}
                  onChange={(event) =>
                    handleOrderValueChange(
                      "client_order_no",
                      event.target.value
                    )
                  }
                  error={order.client_order_no == ""}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="vendor_order_no"
                  label="Vendor Order No"
                  fullWidth
                  value={order.vendor_order_no}
                  onChange={(event) =>
                    handleOrderValueChange(
                      "vendor_order_no",
                      event.target.value
                    )
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Select
                  displayEmpty={true}
                  renderValue={(value) =>
                    !value ? "Select shiping type" : value
                  }
                  key={order?.ship_type}
                  name="ship_type"
                  value={order?.ship_type}
                  onChange={(event) =>
                    handleOrderValueChange("ship_type", event.target.value)
                  }
                  fullWidth
                  error={order?.ship_type ? false : true}
                >
                  <MenuItem value={"By Sea"}>By Sea</MenuItem>
                  <MenuItem value={"By Air"}>By Air</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="ship_country"
                  label="Ship Country"
                  fullWidth
                  value={order.ship_country}
                  error={order.ship_country == ""}
                  onChange={(event) =>
                    handleOrderValueChange("ship_country", event.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="ship_address"
                  label="Ship Address"
                  fullWidth
                  value={order.ship_address}
                  error={order.ship_address == ""}
                  onChange={(event) =>
                    handleOrderValueChange("ship_address", event.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="reference"
                  label="Reference"
                  fullWidth
                  value={order.reference}
                  onChange={(event) =>
                    handleOrderValueChange("reference", event.target.value)
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  name="remarks"
                  label="Remarks"
                  fullWidth
                  value={order.remarks}
                  onChange={(event) =>
                    handleOrderValueChange("remarks", event.target.value)
                  }
                />
              </Grid>
            </Grid>
            
          </Box>
          <Box
            sx={{
              width: { xs: "93vw", lg: `calc(95vw - ${util.sidebarWidth}px)` },
              p: 2,
              my: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  options={articles}
                  getOptionLabel={(option: any) =>
                    `${option.art_no}(${option.barcode}) --> ${option.art_name} --> ${option.color} --> ${option.size}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="article" />
                  )}
                  value={selectedArticle}
                  onChange={handleChangeArticle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  disabled
                  name="color"
                  label="Color"
                  fullWidth
                  value={addRecord.color}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  disabled
                  name="size"
                  label="Size"
                  fullWidth
                  value={addRecord.size}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  disabled
                  name="barcode"
                  label="barcode"
                  fullWidth
                  value={addRecord.barcode}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  disabled
                  label="Price"
                  fullWidth
                  value={addRecord.price}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  type="number"
                  label="Qty"
                  fullWidth
                  value={addRecord.qty}
                  onChange={(event) => {
                    setAddRecord({
                      ...addRecord,
                      ["qty"]: parseInt(event.target.value),
                      ["total"]: addRecord.price * parseInt(event.target.value),
                    });
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  disabled
                  label="total"
                  fullWidth
                  value={addRecord.total}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ width: 100 }}
                    onClick={handleAddRecord}
                  >
                    Add
                  </Button>

                  <InputFileUpload
                    lable={"upload Excel file"}
                    fileChange={handleFileChange}
                    isIcon={true}
                    size="small"
                    ref={uploadRef}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
        <OrderDetail order={order} handleOrder={setOrder} />
        <Box component={"div"} sx={{ mt: 2 }}>
          {notFoundArticles.length > 0 &&
            notFoundArticles.map((barcode: any) => (
              <Typography variant="body2" key={barcode} color="error">
                {`Article not found for barcode:  ${barcode}`}
              </Typography>
            ))}
        </Box>
        <Box component={"div"} sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            disabled={notFoundArticles.length > 0}
            onClick={handleSaveRecord}
            variant="outlined"
            sx={{ width: 100 }}
          >
            {order.order_no ? "Update" : "Save"}
          </Button>
          <Button variant="outlined" color="error" sx={{ width: 100 }}
          onClick={handleDeleteConfirmation}
          >
            Delete
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1} key={1}>
        <Box
          sx={{
            width: {
              xs: `calc(100vw - ${util.erpGridMarginX}px)`,
              lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
            },

            mt: 2,
            "& .order-id:hover": {
              textDecoration: "underline",
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <ERPGridWithDateRange
            ref={gridRef}
            gridHeight={"70vh"}
            exportToExcel={true}
            columnDefs={colDefs}
            rowData={allOrders}
            getData={getAllOrdersWithDateRange}
          />
        </Box>
      </TabPanel>
      <ERPSnakBar
        open={alert.open}
        message={alert.message}
        serverity={alert.serverity}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploadingOrder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog
        open={openConfrimDlg}
        title={"Deletion"}
        content={"sure to delete ?"}
        onCancel={setOpenConfrimDlg}
        onConfirm={handleDeleteRecord}
        btnColor={"error"}
      />
    </Box>
  );
}

export default AddOrder;
