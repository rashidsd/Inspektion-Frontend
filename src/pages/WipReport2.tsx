import Box from "@mui/material/Box";
import { AgGridReact } from "ag-grid-react";
import { getClientWip } from "../services/wipService";
import { useEffect, useRef, useState } from "react";
import ERPSnakBar from "../components/ERPSnakBar";
import ERPGrid from "../components/ERPGrid";

import dayjs from "dayjs";
import { ColDef } from "ag-grid-community";
import useLocalStorage from "../hooks/useLocalStorage";

import Button from "@mui/material/Button";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ReportAnalysis2 from "../components/ReportAnalysis2";
import Typography from "@mui/material/Typography";
import * as XLSX from "xlsx";
import download from "downloadjs";
import { ExportToExcel } from "../util/globals";

function WipReport2() {
  const [list, setList] = useState<any>([]);
  const { client_id } = useLocalStorage();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });
  const gridRef = useRef<AgGridReact>(null);

  const columns: ColDef[] = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 80,
      filter: true,
      wrapText: true,      // enable text wrapping
    autoHeight: true,    // adjust height automatically
    cellStyle: {
      whiteSpace: "normal", // allow line breaks
      lineHeight: "1.4em",  // better spacing
      pinned: "left"
    }
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 80,
      filter: true,
      wrapText: true,      // enable text wrapping
    autoHeight: true,    // adjust height automatically
    cellStyle: {
      whiteSpace: "normal", // allow line breaks
      lineHeight: "1.4em",  // better spacing
      pinned: "left"
    }
    },
    {
      field: "po_no",
      headerName: "PO No",
      width: 80,
      filter: true,
      pinned: "left"
    },
    {
      field: "po_date",
      headerName: "PO Date",
      filter: true,
      pinned: "left",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 90,
      headerClass: "ag-header-cell-content",
      sortable: false,

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YY");
      },
    },
    {
      field: "sku_number",
      headerName: "SKU Number",
      width: 110,
      filter: true,
      wrapText: true,      // enable text wrapping
    autoHeight: true,    // adjust height automatically
    },
    {
      field: "style_name",
      headerName: "Style Name",
      width: 130,
      filter: true,
      wrapText: true,      // enable text wrapping
    autoHeight: true,    // adjust height automatically
    cellStyle: {
      whiteSpace: "normal", // allow line breaks
      lineHeight: "1.4em",  // better spacing
      pinned: "left"
    }
    },
    {
      field: "units_order",
      headerName: "Total Units Orderd",
      width: 60,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      pinned: "left"
    },
    {
      field: "shiped_qty_real",
      headerName: "Shiped Qty",
      width: 60,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      pinned: "left"
    },
    {
      field: "units_order_inhand",
      headerName: "Remaining Qty",
      width: 70,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      pinned: "left"
  },
    
    {
      field: "Report_Dates",
      headerName: "Report Dates",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      width: 120,
      cellRenderer: (params: any) => (
        <Box
          sx={{
            "& .MuiTypography-root": {
              fontSize: "0.70rem",
            },
          }}
        >
          <Typography variant="body2" color="primary">
            {`Curr Dt: ${
              list?.find((d: any) => d.last_save_date != null)?.last_save_date
            }`}
          </Typography>
          <Typography variant="body2" color="success">
            {`Prev Dt: ${
              list?.find((d: any) => d.second_last_save_date != null)
                ?.second_last_save_date
            }`}
          </Typography>
          <Typography variant="body2" color="error">
            {`First Dt: ${
              list?.find((d: any) => d.first_save_date != null)?.first_save_date
            }`}
          </Typography>
        </Box>
      ),
    },

    {
      field: "material_order_date",
      headerName: "Material Order Date",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_material_order_date}
          prv={params.data.s_material_order_date}
          cur={params.data.material_order_date}
          diff={params.data.material_diff}
          firstDiff={params.data.material_diff_first}
        />
      ),
    },
    {
      field: "material_inhouse_date",
      headerName: "Material In House Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_material_inhouse_date}
          prv={params.data.s_material_inhouse_date}
          cur={params.data.material_inhouse_date}
          diff={params.data.material_inhouse_diff}
          firstDiff={params.data.material_inhouse_diff_first}
        />
      ),
    },
    {
      field: "sample_start_date",
      headerName: "Sample Start Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_sample_start_date}
          prv={params.data.s_sample_start_date}
          cur={params.data.sample_start_date}
          diff={params.data.sample_start_date_diff}
          firstDiff={params.data.sample_start_date_diff_first}
        />
      ),
    },
    {
      field: "sample_send_date",
      headerName: "Sample Send Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_sample_send_date}
          prv={params.data.s_sample_send_date}
          cur={params.data.sample_send_date}
          diff={params.data.sample_send_date_diff}
          firstDiff={params.data.sample_send_date_diff_first}
        />
      ),
    },
    {
      field: "sample_approval_date",
      headerName: "Sample Approval Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_sample_approval_date}
          prv={params.data.s_sample_approval_date}
          cur={params.data.sample_approval_date}
          diff={params.data.sample_approval_date_diff}
          firstDiff={params.data.sample_approval_date_diff_first}
        />
      ),
    },
    {
      field: "production_start_date",
      headerName: "Production Start Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_production_start_date}
          prv={params.data.s_production_start_date}
          cur={params.data.production_start_date}
          diff={params.data.production_start_date_diff}
          firstDiff={params.data.production_start_date_diff_first}
        />
      ),
    },
    {
      field: "completed_units_as_per_date",
      headerName: "Completed Units As of Report Date",
      width: 80,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
    },
    {
      field: "units_per_day",
      headerName: "Units Per Day",
      width: 50,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
    },
    {
      field: "top_send_date",
      headerName: "Top Send Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_top_send_date}
          prv={params.data.s_top_send_date}
          cur={params.data.top_send_date}
          diff={params.data.top_send_date_diff}
          firstDiff={params.data.top_send_date_diff_first}
        />
      ),
    },
    {
      field: "off_line_date",
      headerName: "Off Line Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_off_line_date}
          prv={params.data.s_off_line_date}
          cur={params.data.off_line_date}
          diff={params.data.off_line_date_diff}
          firstDiff={params.data.off_line_date_diff_first}
        />
      ),
    },
    {
      field: "qa_complete_date",
      headerName: "QA Complete Date",

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_qa_complete_date}
          prv={params.data.s_qa_complete_date}
          cur={params.data.qa_complete_date}
          diff={params.data.qa_complete_date_diff}
          firstDiff={params.data.qa_complete_date_diff_first}
        />
      ),
    },
    {
      field: "finish_packing_date",
      headerName: "Finish Packing Date",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_finish_packing_date}
          prv={params.data.s_finish_packing_date}
          cur={params.data.finish_packing_date}
          diff={params.data.finish_packing_date_diff}
          firstDiff={params.data.finish_packing_date_diff_first}
        />
      ),
    },
    {
      field: "approved_xfactory_date",
      headerName: "Approved X-Factory Date",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 80,
      headerClass: "ag-header-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YY");
      },
    },
    {
      field: "estimated_xfactory_date",
      headerName: "Estimated X-Factory Date",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      cellRenderer: (params: any) => (
        <ReportAnalysis2
          first={params.data.f_estimated_xfactory_date}
          prv={params.data.s_estimated_xfactory_date}
          cur={params.data.estimated_xfactory_date}
          diff={params.data.estimated_xfactory_date_diff}
          firstDiff={params.data.estimated_xfactory_date_diff_first}
        />
      ),
    },
    {
      field: "ship_date_diff",
      headerName: "Ship Date Diff",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      width: 60,
    },
    

    {
      field: "vendor_remarks",
      headerName: "Vendor Remarks",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "material_diff",
      hide: true,
    },
  ];

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response: any = await getClientWip(client_id);

      setList(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: error.response.data.message,
        serverity: "error",
      });
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleExportToExcel = () => {
    const columnsToExport = [
      "brand",
      "vendor",
      "po_no",
      "po_date",
      "sku_number",
      "style_name",
      "units_order",
      "shiped_qty_real",
      "units_order_inhand",
      "material_order_date",
      "material_inhouse_date",
      "sample_start_date",
      "sample_send_date",
      "sample_approval_date",
      "production_start_date",
      "completed_units_as_per_date",
      "units_per_day",
      "top_send_date",
      "off_line_date",
      "qa_complete_date",
      "finish_packing_date",
      "approved_xfactory_date",
      "estimated_xfactory_date",
      "ship_date_diff",
    ];
    const filteredList = list.map((item: any) => {
      const filteredItem: any = {};
      columnsToExport.forEach((column) => {
        filteredItem[column] = item[column];
      });
      return filteredItem;
    });

    // const worksheet = XLSX.utils.json_to_sheet(filteredList);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "WIP Report");

    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: "xlsx",
    //   type: "array",
    // });

    const blob = ExportToExcel(filteredList, "WIP Report", [], [
      "po_date",
      "material_order_date",
      "material_inhouse_date",
      "sample_start_date",
      "sample_send_date",
      "sample_approval_date",
      "production_start_date",
      "top_send_date",
      "off_line_date",
      "qa_complete_date",
      "finish_packing_date",
      "approved_xfactory_date",
      "estimated_xfactory_date"
    ]);

    // const blob = new Blob([excelBuffer], {
    //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // });

    download(
      blob,
      "wip_report.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };
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
          border: "1px solid rgba(0,0,0,0.04)",
          p: 1,
          display: "flex",
          gap: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Button
          sx={{ width: "180px" }}
          variant="outlined"
          color="success"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>

        <Button
          sx={{ width: "180px" }}
          onClick={handleRefresh}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          mt: 2,
          "& .ag-cell" : {
            fontSize: "0.6rem",
            paddingLeft: "6px !important",
          },
          "& .header-cell-text , .ag-header-cell": {
            fontSize: "0.6rem",
            paddingLeft: "6px !important",
            paddingRight: "6px !important",
            fontWeight: "bold",
          }
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"100%"}
          gridWidth={"100%"}
          rowData={list}
          columnDefs={columns}
          heading="WIP Report"
          rowHeight={60}
        />
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
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

export default WipReport2;
