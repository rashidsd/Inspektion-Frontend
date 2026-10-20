import { useState, useEffect, useRef, useCallback } from "react";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getClientForSelection } from "../services/clientService";
import { getVendorForSelection } from "../services/vendorService";
import { util } from "../util";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ShipDataType } from "../customTypes/customTypes";
import ERPSnakBar from "../components/ERPSnakBar";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import ERPGrid from "../components/ERPGrid";
import { ColDef } from "ag-grid-community";
import {
  saveShipData,
  getShipData,
  articleSelection,
  deleteShipData,
} from "../services/shipDataService";
import { getPOs } from "../services/inspection/finalService";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShippingDetail from "../components/ShippingDetail";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { InputLabel } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return value === index && <Box {...other}>{children}</Box>;
}

function ShipData() {
  const [value, setValue] = useState(0);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [allShipData, setAllShipData] = useState([]);
  const [POs, setPOs] = useState([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const gridRef = useRef<AgGridReact>(null);
  const [loading, setLoading] = useState(false);
  const shipRef = useRef<any>(null);
  const remarksRef = useRef<any>(null);
  const blRef = useRef<any>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const newShipData = () => {
    return {
      client_id: "",
      vendor_id: "",
      order_no: "",
      client_order_no: "",
      article_id: "",
      color: "",
      size: "",
      qty: 0,
      price: 0,
      amount: 0,
      ship_type: "",
      ship_no: "",
      ship_date: "",
      remarks: "",
    };
  };

  const [shipData, setShipData] = useState<ShipDataType>(newShipData());

  const colDefs: ColDef[] = [
    {
      field: "client",
      headerName: "Client",
      width: 150,
      filter: true,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 150,
    },
    {
      field: "client_order_no",
      headerName: "PO No",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "art_name",
      headerName: "Article",
      sortable: true,
      filter: true,
      width: 300,
    },
    {
      field: "color",
      headerName: "Color",
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      field: "size",
      headerName: "Size",
      width: 130,
      filter: true,
      sortable: true,
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 120,
      filter: true,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      filter: true,
      sortable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      filter: true,
      sortable: true,
    },
    {
      field: "ship_type",
      headerName: "Shipping Type",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "ship_no",
      headerName: "Shipping No",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "ship_date",
      headerName: "Shipping Date",
      minWidth: 150,
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format("DD-MM-YYYY"),
    },
  
    {
      field: "remarks",
      headerName: "Remarks",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <IconButton onClick={() => handleDeleteRecord(params.data.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        );
      },
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

  const handleChangeClient = async (event: any, value: any) => {
    try {
      const response: any = await getPOs(value?.id, selectedVendor?.id);
      setPOs(response.data);
      setSelectedClient(value);
      setShipData({ ...shipData, client_id: value?.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeVendor = async (event: any, value: any) => {
    const response: any = await getPOs(selectedClient?.id, value?.id);
    setPOs(response.data);
    setSelectedVendor(value);
    setShipData({ ...shipData, vendor_id: value?.id });
  };

  const handleChangePO = async (event: any, value: any) => {
    try {
      setLoading(true);
      const response: any = await articleSelection(value?.order_no);
      if (response.status) {
        setSelectedPO(value);
        setArticles(response.data);
        setShipData({
          ...shipData,
          order_no: value?.order_no,
          client_order_no: value?.client_order_no,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handTabChange = async (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    // console.log("tab changed", newValue);
    setValue(newValue);
    if (newValue == 1) {
      console.log("tab changed", newValue);
      console.log("client id", selectedClient?.id);
      console.log("vendor id", selectedVendor?.id);
      await handleAllShipData(selectedClient?.id, selectedVendor?.id);
      return;
    }
  };

  const handleNewRecord = () => {
    setShipData(newShipData());
    setSelectedPO(null);
    setSelectedArticle(null);
    setSelectedClient(null);
    setSelectedVendor(null);
    setArticles([]);
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      const response: any = await deleteShipData(id);
      if (response.status) {
        setAlert({
          open: true,
          message: "Record deleted successfully",
          serverity: "success",
        });
      }
      await handleAllShipData(selectedClient?.id, selectedVendor?.id);
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

  const isValidOrder = () => {
    if (
      shipRef.current.value == "" ||
      shipRef.current.value == undefined ||
      shipData.client_id == "" ||
      shipData.vendor_id == "" ||
      selectedPO == null ||
      shipData.ship_type == "" ||
      shipData.ship_date == ""
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
    console.log("shipData", shipData);
    console.log("ship no", shipRef?.current.value);
    console.log("PO", selectedPO);

    if (!isValidOrder()) return;

    const shipDataArray = articles
      .filter((art: any) => art.shipping > 0)
      .map((article: any) => {
        return {
          client_id: selectedClient?.id,
          vendor_id: selectedVendor?.id,
          order_no: article.order_no,
          client_order_no: selectedPO?.client_order_no,
          article_id: article.article_id,
          color: article.color,
          size: article.size,
          qty: article.shipping,
          price: article.price,
          amount: article.price * article.shipping,
          ship_type: shipData.ship_type,
          ship_no: shipRef?.current?.value,
          ship_date: shipData.ship_date,
          remarks: remarksRef?.current?.value,
          bl_no: blRef?.current?.value,
        };
      });

    setLoading(true);
    try {
      const response: any = await saveShipData(shipDataArray);
      if (response.status) {
        setAlert({
          open: true,
          message: "Record saved successfully",
          serverity: "success",
        });
        const response: any = await articleSelection(selectedPO?.order_no);
        setArticles(response.data);
      }

      await handleAllShipData(selectedClient?.id, selectedVendor?.id);
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

  const handleAllShipData = async (client_id: string, vendor_id: string) => {
    try {
      const response: any = await getShipData(client_id, vendor_id);
      setAllShipData(response?.data);
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" color="primary">
          Manage Shipping Data
        </Typography>

        <Tabs value={value} onChange={handTabChange}>
          <Tab label="Shipping Data" value={0} />
          <Tab label="Shipping List" value={1} />
        </Tabs>
        <TabPanel value={value} index={0} key={0}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                width: {
                  xs: "93vw",
                  lg: `calc(95vw - ${util.sidebarWidth}px)`,
                },
                p: 2,
                my: 1,

                border: "1px solid rgba(0, 0, 0, 0.04)",
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
                  New Record
                </Button>
              </Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
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
                <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Autocomplete
                    options={POs}
                    getOptionLabel={(option: any) => option?.client_order_no}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="PO No"
                        error={selectedPO == null}
                      />
                    )}
                    value={selectedPO}
                    onChange={handleChangePO}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Select
                    displayEmpty={true}
                    renderValue={(value) =>
                      !value ? "Select shiping type" : value
                    }
                    key={shipData?.ship_type}
                    name="ship_type"
                    value={shipData?.ship_type}
                    fullWidth
                    onChange={(e) =>
                      setShipData({ ...shipData, ship_type: e.target.value })
                    }
                    error={shipData?.ship_type ? false : true}
                  >
                    <MenuItem value={"By Sea"}>By Sea</MenuItem>
                    <MenuItem value={"By Air"}>By Air</MenuItem>
                    <MenuItem value={"By Courier"}>By Courier</MenuItem>
                  </Select>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    name="ship_no"
                    label="Shipping No"
                    fullWidth
                    inputRef={shipRef}
                    slotProps={{ inputLabel: { shrink: true } }}

                    //value={shipRef.current.value || ""}
                    // onChange={(e) => setStShipNo(e.target.value)}
                    // error={stShipNo == "" || stShipNo == undefined}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <DatePicker
                    label="Shipment Date"
                    format="DD-MM-YYYY"
                    sx={{
                      width: "100%",
                    }}
                    value={dayjs(shipData.ship_date)}
                    onChange={(date) =>
                      setShipData({
                        ...shipData,
                        ship_date: dayjs(date).format("YYYY-MM-DD"),
                      })
                    }
                  />
                 
                </Grid>
                 
                <Grid size={{ xs: 12,md:8}}>
                  <TextField
                    name="remarks"
                    label="Remarks"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    inputRef={remarksRef}
                  />
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
          <Box>
            <ShippingDetail list={articles} />
          </Box>

          <Box component={"div"} sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              onClick={handleSaveRecord}
              variant="outlined"
              disabled={loading}
              sx={{ width: 100 }}
            >
              Save
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} key={1}>
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
              gridHeight={"70vh"}
              exportToExcel={true}
              columnDefs={colDefs}
              rowData={allShipData}
            />
          </Box>
        </TabPanel>
        <ERPSnakBar
          open={alert.open}
          message={alert.message}
          serverity={alert.serverity}
          onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        />
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default ShipData;
