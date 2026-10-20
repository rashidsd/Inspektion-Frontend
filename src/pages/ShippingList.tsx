import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Autocomplete,
  TextField,
  Paper,
  FormControlLabel,
  Switch,
  Select,
  MenuItem
 
  
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ERPGrid from "../components/ERPGrid";
import { ColDef } from "ag-grid-community";
import ERPSnakBar from "../components/ERPSnakBar";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  getShipDataByClient,
  getShipDataAll,
  updateBillNoAndDate,
  updateShipDataByShipNo,
  updateRemarks,
} from "../services/shipDataService";
import { getClientForSelection } from "../services/clientService";
import download from "downloadjs";
import { ExportToExcel } from "../util/globals";
import { get, set } from "lodash";
import InlineEditCell from "../components/InlineEditCell";
import DateValue from "../components/DateValue";
import { Label } from "@mui/icons-material";


function ShippingList() {
  const theme = useTheme();
  const [list, setList] = useState([]);
  const [data,setData]=useState([])
  const [loading, setLoading] = useState(false);
  const [blNo,setBlNo]=useState("")
  const [shipNo,setShipNo]=useState("") 
  const [blDate,setBlDate]=useState(dayjs(new Date()))
  const [showEdit,setShowEdit]=useState(false)  
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
  const { user_type, client_id } = useLocalStorage();
  const [pinnedRows, setPinnedRows] = useState<any[]>([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [editShipNo,setEditShipNo]=useState("")
  const [editShipDate,setEditShipDate] = useState<Dayjs | null>(null)
  const [editBlNo,setEditBlNo]=useState("")
  const [editBlDate,setEditBlDate]=useState<Dayjs | null>(null)
  const [editClose,setEditClose]=useState<boolean>(false)
  const [closeOpen,setCloseOpen]=useState<string>("false")

  const colDefs: ColDef[] = [
   {
      filter: true,
      field: "ship_no",
      headerName: "Shipping No",
      width: 150,
      cellClass:"shipping_no",
      onCellClicked: (params: any) => handleStartEdit(params),
    },
    {
      filter: true,
      field: "ship_date",
      headerName: "Shipping Date",
      cellClass: "common-cell-format",
      width: 110,
      cellRenderer: (params: any) => <DateValue value={params.value} />
    },
    {
      filter: true,
      field: "vendor",
      headerName: "Vendor",
      width: 120,
    },
    {
      field: "client_order_no",
      headerName: "PO No",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      field: "brand",
      headerName: "Brand",
      sortable: true,
      filter: true,
      width: 110,
    },
    {
      field: "barcode",
      headerName: "Barcode",
      sortable: true,
      filter: true,
      width: 110,
    },
    {
      field: "art_name",
      headerName: "Article",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "color",
      headerName: "Color",
      width: 130,
      filter: true,
      sortable: true,
    },
    {
      field: "size",
      headerName: "Size",
      width: 100,
      filter: true,
      sortable: true,
    },
    {
      field: "qty",
      headerName: "Qty",
      width: 90,
      filter: true,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 90,
      filter: true,
      sortable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
      filter: true,
      sortable: true,
    },
    {
      filter: true,
      field: "ship_type",
      headerName: "Shipping Type",
      width: 110,
    },
    
    {
      filter: true,
      field: "approved_ship_date",
      cellClass: "common-cell-format",
      headerName: "Approved ShipDate",
     cellRenderer: (params: any) => <DateValue value={params.value} />,
     width: 110
    },
    {
      filter: true,
      field: "bl_no",
      headerName: "BL No",
      width: 110,
    },
    {
      filter: true,
      field: "bl_date",
      headerName: "BL Date",
      minWidth: 130,
      width: 150,
      cellRenderer: (params: any) => <DateValue value={params.value} />,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      minWidth: 250,
      cellRenderer: (params: any) =>
        params.data.size != "Total" && (
          <InlineEditCell
            key={params.data.id}
            value={params.data.remarks}
            inputType="text"
            onSave={(val) => updateRemarks(params.data.id, val)}
            getUpdateList={getShippingList}
            successMessage="Remarks updated successfully"
            onSuccess={(message) => setAlert({ open: true, message, serverity: "success" })}
            onError={(message) => setAlert({ open: true, message, serverity: "error" })}
          />
        ),
      flex: 1,
      suppressKeyboardEvent: (params) => {
      const e = params.event as KeyboardEvent;
      const keys = [
        "ArrowLeft","ArrowRight","ArrowUp","ArrowDown",
        "Home","End","Backspace","Delete"
      ];
      // suppress grid handling if our input is focused or we're “editing” in the renderer
      const target = e.target as HTMLElement | null;
      const isInput =
        !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      return (isInput || params.editing) && keys.includes(e.key);
    },
    },
  ];

  const getShippingList = async () => {
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
          ? await getShipDataByClient(
              selectedClient?.id,
              dayjs(fromDate).format("YYYY-MM-DD"),
              dayjs(toDate).format("YYYY-MM-DD"),
              closeOpen==="true"? true : false
            )
          : await getShipDataByClient(
              client_id,
              dayjs(fromDate).format("YYYY-MM-DD"),
              dayjs(toDate).format("YYYY-MM-DD"),
              closeOpen==="true"? true : false
            );
      setList(response.data);
      setData(response.data);
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
        size: "Total",
        qty: data.reduce((acc, item) => acc + Number(item.qty), 0),
        amount: data.reduce((acc, item) => acc + Number(item.amount), 0),
        
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

  const handleExportToExcel = () => {
    const blob = ExportToExcel(list, "Shipping List", [
      "id",
      "client_id",
      "client",
      "vendor_id",
      "bl_no",
      "bl_date",
      "is_close",
      "order_no",
      "article_id",
    ], ["ship_date","approved_ship_date"]);
    download(
      blob,
      `Shipping_List.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  const handleStartEdit = (params: any) => {
    setShowEdit(true);
    setShipNo(params.data.ship_no);
    setEditShipNo(params.data.ship_no);
    setEditShipDate(params.data.ship_date ? dayjs(params.data.ship_date) : null);
    setEditBlNo(params.data.bl_no || "");
    setEditBlDate(params.data.bl_date ? dayjs(params.data.bl_date) : null);
    setEditClose(params.data.is_close || false);
  }

  return (
    <Box
      sx={{
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
        </LocalizationProvider>
        <Button variant="outlined" color="primary" onClick={getShippingList} size="small">
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
      </Box>
      
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          mt: 2,
          "& .shipping_no:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
          "& .ag-cell": {
            whiteSpace: "normal !important",
            lineHeight: "1.2 !important",
            fontSize: "0.7rem !important",
             paddingY: "4px",
             paddingX: "6px",
          },
          
          "& .ag-header-cell": {
           whiteSpace: "normal !important",
            lineHeight: "1.4 !important",
           paddingX: "6px",
            textAlign: "center",
            fontSize: "0.75rem !important",
          },
          "& .common-cell-format": {
            textAlign: "center",
          },
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"100%"}
          gridWidth={"100%"}
          columnDefs={colDefs}
          rowData={list}
          heading={"Shipping List"}
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
      <Backdrop open={showEdit} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Paper sx={{ p: 2 ,minWidth: 350,borderRadius: 2 }} elevation={3}>
         
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mt={2} display="flex" justifyContent="flex-end" gap={1} flexDirection={"column"}>
              <TextField label="Shipping No" variant="outlined" fullWidth size="small" 
            slotProps={{inputLabel:{shrink:true}}}
            value= {shipNo} disabled/>

            <TextField label="Shipping No (Edit)" variant="outlined" fullWidth size="small" 
            slotProps={{inputLabel:{shrink:true}}}
            value= {editShipNo} onChange={(e:any)=>setEditShipNo(e.target.value)}
            disabled={editClose}
            />
          <DatePicker label="Shipping Date" slotProps={{textField:{size:"small"}}} format="DD-MM-YYYY"  
          value={editShipDate} onChange={(newValue)=>setEditShipDate(dayjs(newValue))}
           disabled={editClose}
          />
          <TextField label="BL No" variant="outlined" fullWidth size="small" 
           slotProps={{inputLabel:{shrink:true}}}
          value={editBlNo} onChange={(e:any)=>setEditBlNo(e.target.value)}
           disabled={editClose}
          />
         <DatePicker label="BL Date" slotProps={{textField:{size:"small",onKeyDown:(e:any)=> {if(e.key=="Delete" || e.key=="Backspace") { setEditBlDate(dayjs(null)); } }}}} format="DD-MM-YYYY"  
         value={editBlDate} onChange={(newValue)=>setEditBlDate(dayjs(newValue))}
          disabled={editClose}
         />
         
         
          <Button variant="contained" color="primary"
           onClick={async() => {
             const response =await updateShipDataByShipNo(
              shipNo,
               editShipNo || "",
               editShipDate ? editShipDate.format("YYYY-MM-DD") :  null,
               editBlNo || "",
               editBlDate ? editBlDate.format("YYYY-MM-DD") : null
                ,editClose
             );
              if (response.status) {
                setShowEdit(false);
                getShippingList();
              }
           }}
          >
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
         </Box>
          </LocalizationProvider>
        </Paper>
      </Backdrop>
    </Box>
  );
}

export default ShippingList;
