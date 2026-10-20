import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Autocomplete,
  TextField,
  IconButton,
   Select,
  MenuItem,
  Switch,
  
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ERPGrid from "../components/ERPGrid";
import { ColDef } from "ag-grid-community";
import ERPSnakBar from "../components/ERPSnakBar";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  getShipDataByClient,
  getShipDataAll,
  updateBillNoAndDate,
  paymentData,
  updateShipDataByShipNo,
  changeShipmentStatus
} from "../services/shipDataService";
import { getClientForSelection } from "../services/clientService";
import download from "downloadjs";
import { ExportToExcel } from "../util/globals";
import DateValue from "../components/DateValue";
import UpdatePaymentStatusAndRemarks from "../components/UpdatePaymentStatusAndRemarks";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ShowConfirmationDlg from "../util/showConfirmationDlg";
import { get } from "lodash";
import ShowExportDocuments from "../components/ShowExportDocuments";

const params = {
  client_id: "",
  fromDate: "",
  toDate: "",
  openClose: false,
} 


function PaymentForm() {
  const theme = useTheme();
  const [list, setList] = useState([]);
  
  const [loading, setLoading] = useState(false);
  
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  
  const gridRef = useRef<any>(null);
  const { user_type, client_id } = useLocalStorage();
  const [pinnedRows, setPinnedRows] = useState<any[]>([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [invoiceNo,setInvoiceNo]=useState("")
   const [fromDate, setFromDate] = useState(
      dayjs(new Date()).subtract(1, "year")
    );
    const [toDate, setToDate] = useState(dayjs(new Date()));
    const [closeOpen,setCloseOpen]=useState<string>("false")
    const [ShowExportDocumentsDialog, setShowExportDocumentsDialog] = useState<boolean>(false);

  const colDefs: ColDef[] = [
    {field:"is_close", headerName:"Close", width:80,
      cellRenderer:(params:any)=> params.data.invoice_no && <OpenCloseShipment key={params.data.invoice_no} shipNo={params.data.invoice_no} isClose={params.data.is_close} setData={setList}/>,
    },
   {
      filter: true,
      field: "vendor",
      headerName: "Vendor",
      width: 110,
    },
    {
      filter: true,
      field: "ship_type",
      headerName: "Shipping Type",
      width: 90,
      
    },
    {
      filter: true,
      field: "invoice_no",
      headerName: "Invoice No",
      width : 100,
      cellClass: "common-cell-format",
      sortable: true,
    },
    {
      filter: true,
      field: "po_nos",
      headerName: "PO Nos",
      width: 150,
      sortable: true,
    },
    {
      filter: true,
      field: "invoice_date",
      headerName: "Shipping Date",
      cellClass: "common-cell-format",
      width: 100,
      cellRenderer: (params: any) => <DateValue value={params.value} />
  },
  {
      field: "documents",
      headerName: "Documents",
      cellClass: ["doc-link-format", "common-cell-format"],
      headerClass: "common-cell-format",
      width: 100,
      cellRenderer: (params: any) => {
        if (!params.data?.invoice_no) return null;
        return (
          <span
            className="doc-link-text"
            onClick={(e) => {
              e.stopPropagation();
              setInvoiceNo(params.data.invoice_no);
              setShowExportDocumentsDialog(true);
            }}
          >
            {params.value || "documents"}
          </span>
        );
      },
  },
    
    {
      filter: true,
      field: "bl_no",
      headerName: "BL No",
      width: 90,
    },
    {
      field: "bl_date",
      headerName: "BL Date",
       width: 100,
       sortable: true,
      filter: true,
      cellRenderer: (params: any) => <DateValue value={params.value} />
  },
    {
      field: "total_amount",
      headerName: "Total Amount",
       cellClass: "common-cell-format",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      field: "payment_days",
      headerName: "Payment Days",
      cellClass: "common-cell-format",
      sortable: true,
      filter: true,
      width: 90,
    },
    {
      field: "source",
      headerName: "Source",
    
      width: 90,
      filter: true,
      sortable: true,
    },
    {
      field: "due_date",
      headerName: "Due Payment Date",
      cellClass: "common-cell-format",
       width: 110,
      cellRenderer: (params: any) => <DateValue value={params.value} />,
      sortable: true,
      filter: true,
    },
    {
      field: "reminder_date",
      headerName: "Reminder Date",
      width: 150,
      cellRenderer:(params:any)=> params.data.invoice_no &&
      <UpdatePaymentStatusAndRemarks
      fieldName={"reminder_date"}
      cellValue={params.data.reminder_date}
      keyValue={params.data.invoice_no}
      inputType="date"
      getUpdateList={getPaymentData}
      />,
      sortable: true,
      filter: true,
    },
    {
      field: "payment_status",
      headerName: "Payment Status",
      minWidth: 200,
      cellRenderer:(params:any)=> params.data.invoice_no &&
      <UpdatePaymentStatusAndRemarks
      fieldName={"payment_status"}
      cellValue={params.data.payment_status}
      keyValue={params.data.invoice_no}
      getUpdateList={getPaymentData}
      />
     
    },
    
    {
      field: "payment_remarks",
      headerName: "PaymentRemarks",
      minWidth: 250,
      flex: 1,
    },
    
  ];

  const getPaymentData = async () => {
    if (user_type === "Admin" && !selectedClient) {
      setAlert({
        open: true,
        message: "Please select a client",
        serverity: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const response =
        user_type === "Admin"
          ? await paymentData(
              selectedClient?.id,
              fromDate.format("YYYY-MM-DD"),
              toDate.format("YYYY-MM-DD"),
              closeOpen === "true" ? true : false
            )
          : await paymentData(
              client_id,
              fromDate.format("YYYY-MM-DD"),
              toDate.format("YYYY-MM-DD"),
              closeOpen === "true" ? true : false
            );
           
      setList(response.data);
      console.log(response.data);
      getTotalRowCount(response.data);
    } catch (error) {
      console.log(error);
      setAlert({
        open: true,
        message: "Error fetching data",
        serverity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalRowCount = useCallback(
    (data: any[]) => {
      setPinnedRows([]);
      const totalRow = {
        total_amount: data.reduce((acc, item) => acc + Number(item.total_amount), 0)
          .toLocaleString(),
          
      };
      setPinnedRows([totalRow]);
    },
    [pinnedRows]
  );

  const onFilterChanged = useCallback(() => {
    if (!gridRef.current) return;
    const visibleRows: any[] = [];
    gridRef.current.forEachNodeAfterFilterAndSort((node: any) => {
      if (!node.group) {
        visibleRows.push(node.data);
      }
    });
    getTotalRowCount(visibleRows);
  }, [getTotalRowCount]);

  const onGridReady = (params: any) => {
    gridRef.current = params.api;
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
    params.client_id = user_type === "Admin" ? (selectedClient ? selectedClient.id : "") : client_id;
    params.fromDate = fromDate.format("YYYY-MM-DD");
    params.toDate = toDate.format("YYYY-MM-DD");
    params.openClose = closeOpen === "true" ? true : false;
    console.log(params,"params");
  },[selectedClient, fromDate, toDate, closeOpen, user_type, client_id]);




  const handleExportToExcel = () => {
    const blob = ExportToExcel(list, "Payment Data", [
      "client_id",
      "is_close",
      "vendor_id",
    ]);
    download(
      blob,
      "AP_Report.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  return (
    <Box
      sx={{
        // Fit exactly in App content area (header 64 + outlet padding 32) — no page scrollbar
        height: "calc(100vh - 96px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-start",
          gap: 1,
          border: "1px solid lightgray",
          width: "100%",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        
       <DatePicker
                   sx={{ width: { xs: "100%", sm: 150 } }}
                   label="From Date"
                   format="DD-MM-YYYY"
                   value={fromDate}
                   onChange={(newValue) => {
                     setFromDate(dayjs(newValue));
                   }}
                   slotProps={{ textField: { size: "small" } }}
                 />
                 <DatePicker
                 sx={{ width: { xs: "100%", sm: 150 } }}
                   label="To Date"
                   format="DD-MM-YYYY"
                   value={toDate}
                   onChange={(newValue) => {
                     setToDate(dayjs(newValue));
                   }}
                   slotProps={{ textField: { size: "small" } }}
                 />
          
          <Autocomplete
          size="small"
            sx={{
              width: { xs: "100%", sm: 200 },
              display: user_type === "Admin" ? "block" : "none",
            }}
            options={clients}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params) => <TextField {...params} label="Client"   />}
            value={selectedClient}
            onChange={(_, newValue) => {
              setSelectedClient(newValue);
            }}
            
          />

          <Select
            size="small"
            sx={{
              width: { xs: "100%", sm: 100 },
            }}
            value={closeOpen}
            onChange={(e)=>setCloseOpen(e.target.value as string)}
          >
           <MenuItem value={"false"}>Open</MenuItem>
            <MenuItem value={"true"}>Closed</MenuItem>
            
          </Select>
        
        <Button variant="outlined" color="primary" onClick={getPaymentData} size="small">
          Refresh
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={handleExportToExcel}
          sx={{ display: list?.length > 0 ? "block" : "none" }}
        >
          To Excel
        </Button>
         </LocalizationProvider>
      </Box>
      
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          mt: 2,
          "& .order-id:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
          "& .ag-cell": {
            whiteSpace: "normal !important",
            lineHeight: "1.2 !important",
            fontSize: "0.7rem !important",
          paddingY: "4px",
          paddingX: "4px",
          },
         
          "& .ag-header-cell": {
            flex: 1,
            whiteSpace: "normal !important",
            lineHeight: "1.4 !important",
            // minWidth: "120px",
            textAlign: "center",
            fontSize: "0.75rem !important",
            paddingX: "4px",
          },
          "& .common-cell-format" : {
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .doc-link-format" : {
            textAlign: "center",
            color: (theme) => theme.palette.primary.main,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .doc-link-text": {
            color: (theme) => theme.palette.primary.main,
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"100%"}
          gridWidth={"100%"}
          columnDefs={colDefs}
          rowData={list}
          heading={"Payment Data"}
          pinnedBottomRowData={pinnedRows}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
          rowHeight={35}  
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
      {ShowExportDocumentsDialog && invoiceNo && (
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={ShowExportDocumentsDialog}
          onClick={() => setShowExportDocumentsDialog(false)}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <ShowExportDocuments
              shipNo={invoiceNo}
              closeDialog={setShowExportDocumentsDialog}
            />
          </Box>
        </Backdrop>
      )}
    </Box>
  );
}

  const OpenCloseShipment = ({shipNo, isClose,setData}: {shipNo:string, isClose:boolean, setData: React.Dispatch<React.SetStateAction<any>>})=>{
  const [isCloseState, setIsCloseState] = useState<boolean>(isClose);
  const handleChangeStatus = async (e:any)=>{
    setIsCloseState(e.target.checked);
    const result = await ShowConfirmationDlg({title: "Sure to Change Shipment Status ?"})
    if(result){
     
      try {
        await changeShipmentStatus(shipNo, e.target.checked);
        const paymentDataResult = await paymentData(params.client_id, params.fromDate, params.toDate, params.openClose);
        
        setData(paymentDataResult.data);
      } catch (error) {
        console.log(error);
      }
    }else{
      setIsCloseState(!e.target.checked);
    }
  }
  return (
    <>
    
      <Switch
        checked={isCloseState}
        name="openCloseSwitch"
        color="primary"
        onChange={(e) => handleChangeStatus(e)}
        size="small"
      />
     
      </>
  
  )
}

export default PaymentForm;
