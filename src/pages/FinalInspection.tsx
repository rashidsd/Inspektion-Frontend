import { useState, useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { util } from "../util";
import { getClientForSelection } from "../services/clientService";
import { getVendorForSelection } from "../services/vendorService";
import {
  getPOs,
  saveInspectionMaster,
  getInspectionDetail,
  getInspectionList,
  getInspectionMaster,
  updateInspectionMaster,
} from "../services/inspection/finalService";
import ArticleInfo from "../components/inspections/ArticleInfo";
import { finalInspection } from "../customTypes/customTypes";
import ERPGrid from "../components/ERPGrid";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import ERPSnakBar from "../components/ERPSnakBar";
import Backdrop from "@mui/material/Backdrop";
import TakePicture from "../components/TakePicture";
import Show_Inspection_Images from "../components/inspections/Show_Inspection_Images";
import { getOrderPictures } from "../services/inspection/inspection_picture_Service";
import { useFinalInspectionStore } from "../store/final_inspection_store";
import FinalInspectionResults from "../components/FinalInspectionResults";
import DownLoadFinalInspection from "../components/DownLoadFinalInspection";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return value === index && <Box {...other}>{children}</Box>;
}

function FinalInspection() {
  const [value, setValue] = useState(0);
  const [clients, setClients] = useState<[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [vendors, setVendors] = useState<[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [POs, setPOs] = useState([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [inspectionList, setInspectionList] = useState<any[]>([]);
  const [inspectionIno, setInspectionInfo] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact>(null);
  const [takePicture, setTakePicture] = useState(false);
  const [orderImageList, setOrderImageList] = useState<any[]>([]);

  const total_order_images = useFinalInspectionStore(
    (state) => state.total_order_images
  );

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const [inspectionMaster, setInspectionMaster] = useState<finalInspection>({
    id: "",
    dated: new Date().toISOString(),
    client_id: "",
    vendor_id: "",
    po_no: "",
    po_date: new Date().toISOString(),
    factory_order_no: "",
    inspection_type: "",
    order_qty: 0,
    packed_qty: 0,
    presented_qty: 0,
    carton_qty: 0,
    article_with_colors: "",
    reference_sample: "",
    factory_cooporation: "",
    factory_organization: "",
    inspection_room: "",
    inspection_team_opinion: "",
    inspector_name: "",
    prepared_by: "",
    verified_by: "",
    approved_by: "",
    remarks: "",
    order_no: "",
    result_summary: "",
    article_colors: "",
  });

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "inspection_no",
      width: 150,
      cellClass: "InspectionNo",
      cellRenderer: (param: any) => (
        <Box
          component="div"
          onClick={() => handleShowInspectionMaster(param.data.id)}
        >
          {param.data.id}
        </Box>
      ),
    },
    {
      field: "dated",
      headerName: "Date",
      width: 150,
    },
    {
      field: "client_name",
      headerName: "Client",
      width: 150,
    },
    {
      field: "vendor_name",
      headerName: "Vendor",
      width: 150,
    },
    {
      field: "po_no",
      headerName: "PO No",
      width: 150,
    },
    {
      field: "order_no",
      headerName: "Order No",
      minWidth: 150,
      flex: 1,
    },
  ];

  const handleShowInspectionMaster = async (inspection_no: string) => {
    try {
      const response: any = await getInspectionMaster(inspection_no);
      setInspectionMaster(response.data[0]);
      setSelectedClient({
        id: response.data[0].client_id,
        name: response.data[0].client_name,
      });
      setSelectedVendor({
        id: response.data[0].vendor_id,
        name: response.data[0].vendor_name,
      });
      setSelectedPO({
        order_no: response.data[0].order_no,
        client_order_no: response.data[0].po_no,
      });
      const result: any = await getInspectionDetail(
        response.data[0].order_no,
        response.data[0].id
      );
      const pictures: any = await getOrderPictures(response.data[0].order_no);
      setOrderImageList(pictures.data);
      setInspectionInfo(result.data);

      setValue(0);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInspectionList = async () => {
    try {
      const to_date = dayjs(new Date()).format("YYYY-MM-DD");
      const from_date = dayjs(new Date())
        .subtract(3, "months")
        .format("YYYY-MM-DD");
      const response: any = await getInspectionList(from_date, to_date);
      setInspectionList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (newValue === 1) {
      handleInspectionList();
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
    const fetchOrderImages = async () => {
      const orderno = inspectionMaster.order_no
        ? inspectionMaster.order_no
        : "000";
      const response: any = await getOrderPictures(orderno);
      setOrderImageList(response.data);
    };
    fetchOrderImages();
  }, [total_order_images]);

  const handleChangeClient = async (event: any, value: any) => {
    try {
      setSelectedClient(value);
      setSelectedPO(null);
      setInspectionMaster({
        ...inspectionMaster,
        client_id: value.id,
      });
      const response: any = await getPOs(value.id, selectedVendor?.id);
      setPOs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeVendor = async (event: any, value: any) => {
    setSelectedVendor(value);
    setSelectedPO(null);
    setInspectionMaster({
      ...inspectionMaster,
      vendor_id: value.id,
    });
    const response: any = await getPOs(selectedClient?.id, value.id);
    setPOs(response.data);
  };

  const handleChangePO = async (event: any, value: any) => {
    setSelectedPO(value);
    const orderno = value?.order_no || "000";
    const inspection_no = value?.inspection_no || "000";
    const result: any = await getInspectionDetail(orderno, inspection_no);
    setInspectionMaster({
      ...inspectionMaster,
      order_no: orderno,
      po_no: value?.client_order_no,
      article_with_colors: result.data.article_info_string,
      article_colors: result.data.color_info_string,
      inspection_type: "Final Inspection",
    });
    setInspectionInfo(result.data);
  };

  const handleInspectionMasterChange = (e: any) => {
    setInspectionMaster({
      ...inspectionMaster,
      [e.target.name]: e.target.value,
    });
  };
  const handleSave = async () => {
    try {
      if (inspectionMaster.id) {
        await updateInspectionMaster(inspectionMaster);
        setAlert({
          open: true,
          message: "Record Updated",
          serverity: "success",
        });
        return;
      }
      const result: any = await saveInspectionMaster(inspectionMaster);
      setInspectionMaster({ ...inspectionMaster, id: result.data });
      setAlert({
        open: true,
        message: "Record Saved",
        serverity: "success",
      });
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
  const handleTakPicture = () => {
    if (!inspectionMaster.id) {
      setAlert({
        open: true,
        message: "Please save the inspection first",
        serverity: "error",
      });
      return;
    }
    setTakePicture(true);
  };
  return (
    <>
      <Box>
        <Tabs value={value} onChange={handTabChange}>
          <Tab label="Inspection" value={0} />
          <Tab label="Inspections' List" value={1} />
        </Tabs>

        <TabPanel value={value} index={0} key={0}>
          <DownLoadFinalInspection
            inspectionNo={inspectionMaster.id}
            orderNo={selectedPO?.order_no}
          />
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="id"
                    label="ID"
                    fullWidth
                    value={inspectionMaster?.id}
                    onChange={handleInspectionMasterChange}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12 }}></Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <DatePicker
                    label="Inspection Date"
                    format="DD-MM-YYYY"
                    sx={{
                      width: "100%",
                    }}
                    value={dayjs(inspectionMaster.dated ?? new Date())}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Client" fullWidth />
                    )}
                    value={selectedClient}
                    onChange={handleChangeClient}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Autocomplete
                    options={vendors}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Vendors" fullWidth />
                    )}
                    value={selectedVendor}
                    onChange={handleChangeVendor}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Autocomplete
                    options={POs}
                    getOptionLabel={(option: any) =>
                      option.order_no + " - " + option.client_order_no
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select PO" fullWidth />
                    )}
                    value={selectedPO}
                    onChange={handleChangePO}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <DatePicker
                    label="PO Date"
                    format="DD-MM-YYYY"
                    sx={{
                      width: "100%",
                    }}
                    value={dayjs(selectedPO?.dated)}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="factory_order_no"
                    label="Factory Order No"
                    fullWidth
                    value={inspectionMaster?.factory_order_no}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="order_qty"
                    label="Order Qty"
                    fullWidth
                    value={inspectionMaster?.order_qty}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="packed_qty"
                    label="Packed Qty"
                    fullWidth
                    value={inspectionMaster?.packed_qty}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="presented_qty"
                    label="Presented Qty"
                    fullWidth
                    value={inspectionMaster?.presented_qty}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="carton_qty"
                    label="Carton Qty"
                    fullWidth
                    value={inspectionMaster?.carton_qty}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="articles"
                    label="Articles"
                    fullWidth
                    value={inspectionMaster?.article_with_colors}
                    onChange={handleInspectionMasterChange}
                    multiline
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="article_colors"
                    label="Article Colors"
                    fullWidth
                    value={inspectionMaster?.article_colors}
                    onChange={handleInspectionMasterChange}
                    multiline
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="reference_sample"
                    label="Reference Sample"
                    fullWidth
                    value={inspectionMaster?.reference_sample}
                    onChange={handleInspectionMasterChange}
                    multiline
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="factory_cooporation"
                    label="Factory Cooporation"
                    fullWidth
                    value={inspectionMaster?.factory_cooporation}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="factory_organization"
                    label="Factory Organization"
                    fullWidth
                    value={inspectionMaster?.factory_organization}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <Select
                    displayEmpty={true}
                    renderValue={(value: any) =>
                      !value ? "Inspection Room ?" : value
                    }
                    name="inspection_room"
                    fullWidth
                    value={inspectionMaster?.inspection_room}
                    onChange={handleInspectionMasterChange}
                  >
                    <MenuItem value={"Yes"}>Yes</MenuItem>
                    <MenuItem value={"No"}>No</MenuItem>
                  </Select>
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="inspection_team_opinion"
                    label="Inspection Team Opinion"
                    fullWidth
                    value={inspectionMaster?.inspection_team_opinion}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="inspector_name"
                    label="Inspector Name"
                    fullWidth
                    value={inspectionMaster?.inspector_name}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="prepared_by"
                    label="Prepared By"
                    fullWidth
                    value={inspectionMaster?.prepared_by}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="verified_by"
                    label="Verified By"
                    fullWidth
                    value={inspectionMaster?.verified_by}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                  <TextField
                    name="approved_by"
                    label="Approved By"
                    fullWidth
                    value={inspectionMaster?.approved_by}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="remarks"
                    label="Remarks"
                    fullWidth
                    multiline
                    value={inspectionMaster?.remarks}
                    onChange={handleInspectionMasterChange}
                  />
                </Grid>
              </Grid>
              <Box>
                <FinalInspectionResults inspection_no={inspectionMaster.id} />
              </Box>
              <TextField
                sx={{ mt: 1 }}
                name="result_summary"
                label="Result Summary"
                fullWidth
                value={inspectionMaster?.result_summary}
                onChange={handleInspectionMasterChange}
                multiline
              />

              <Button
                sx={{ mt: 1, mb: 0, width: 140 }}
                variant="contained"
                onClick={handleSave}
              >
                {inspectionMaster.id ? "Update" : "Save"}
              </Button>
              <Button
                sx={{ mt: 1, mb: 0, ml: 2, width: 140 }}
                variant="contained"
                color="warning"
                onClick={handleTakPicture}
              >
                Take Picture
              </Button>
            </Box>
          </LocalizationProvider>
          {inspectionMaster.id && (
            <ArticleInfo
              inspectionInfo={inspectionIno}
              order_no={inspectionMaster.order_no}
              inspection_no={inspectionMaster.id}
            />
          )}

          <Show_Inspection_Images imageList={orderImageList} descr={""} />
        </TabPanel>
        <TabPanel value={value} index={1} key={1}>
          <Box
            sx={{
              width: {
                xs: `calc(100vw - ${util.erpGridMarginX}px)`,
                lg: `calc(100vw - ${util.sidebarWidth}px - ${util.erpGridMarginX}px)`,
              },
              mt: 2,
              "& .InspectionNo:hover": {
                textDecoration: "underline",
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <ERPGrid
              ref={gridRef}
              gridHeight={"70vh"}
              exportToExcel={true}
              columnDefs={columns}
              rowData={inspectionList}
            />
          </Box>
        </TabPanel>
        <ERPSnakBar
          open={alert.open}
          onClose={() => setAlert({ open: false, message: "", serverity: "" })}
          serverity={alert.serverity}
          message={alert.message}
        />
      </Box>
      <Backdrop
        open={takePicture}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <TakePicture
          key={new Date().toDateString()}
          params={{
            onClose: setTakePicture,
            inspection_no: inspectionMaster.id,
            order_no: inspectionMaster.order_no,
            isClose: takePicture,
          }}
        />
      </Backdrop>
    </>
  );
}

export default FinalInspection;
