import Box from "@mui/material/Box";
import { AgGridReact } from "ag-grid-react";
import { getVendorWip, createWip } from "../services/wipService";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import ERPSnakBar from "../components/ERPSnakBar";
import ERPGrid from "../components/ERPGrid";
import dayjs from "dayjs";
import {
  ColDef,
  CellEditingStoppedEvent,
  CellEditingStartedEvent,
} from "ag-grid-community";
import useLocalStorage from "../hooks/useLocalStorage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function WipDataVendor() {
  const [list, setList] = useState<any>([]);
  const { client_id, vendor_id, user_type } = useLocalStorage();
  const [currId, setCurId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
      headerName: "Barand",
      width: 150,
      filter: true,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 150,
      filter: true,
    },
    {
      field: "po_no",
      headerName: "PO No",
      width: 120,
      filter: true,
    },
    {
      field: "po_date",
      headerName: "PO Date",
      filter: true,

      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 120,
      headerClass: "ag-header-cell-content",
      sortable: false,

      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY");
      },
    },
    {
      field: "style_name",
      headerName: "Style Name",
      width: 250,
      filter: true,
    },
    {
      field: "units_order",
      headerName: "Total Units Orderd",
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
    },
    {
      field: "shiped_qty",
      headerName: "Shiped Qty",
      wrapHeaderText: true,
      autoHeaderHeight: true,

      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      width: 90,
    },

    {
      field: "material_order_date",
      headerName: "Material Order Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "material_inhouse_date",
      headerName: "Material In House Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "sample_start_date",
      headerName: "Sample Start Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "sample_send_date",
      headerName: "Sample Send Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "sample_approval_date",
      headerName: "Sample Approval Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "production_start_date",
      headerName: "Production Start Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "completed_units_as_per_date",
      headerName: "Completed Units As of Report Date",
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
    },
    {
      field: "units_per_day",
      headerName: "Units Per Day",
      width: 100,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
    },
    {
      field: "top_send_date",
      headerName: "Top Send Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "off_line_date",
      headerName: "Off Line Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "qa_complete_date",
      headerName: "QA Complete Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "finish_packing_date",
      headerName: "Finish Packing Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },
    {
      field: "approved_xfactory_date",
      headerName: "Approved X-Factory Date",
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 120,
      headerClass: "ag-header-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD-MM-YYYY");
      },
    },
    {
      field: "estimated_xfactory_date",
      headerName: "Estimated X-Factory Date",
      editable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 130,
      headerClass: "ag-header-cell-content",
      cellClass: "ag-cell-content",
      sortable: false,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return dayjs(params.value).format("DD-MM-YYYY");
      },
      cellEditor: "agDateStringCellEditor",
    },

    {
      field: "remarks",
      headerName: "Remarks",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "client_id",
      hide: true,
    },
    {
      field: "vendor_id",
      hide: true,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      enableCellChangeFlash: true,
    };
  }, []);

  const onCellEditingStarted = (event: CellEditingStartedEvent) => {
    setCurId(event.data.id);
  };

  const onCellEditingStopped = (event: CellEditingStoppedEvent) => {
    if (currId) {
      const currRowNode = gridRef.current?.api?.getRowNode(currId);
      var data = currRowNode?.data;
      var BalQty = data.units_order - data.shiped_qty;

      if (data.off_line_date && data.production_start_date) {
        const perDayUnits = Math.round(
          data.units_order /
            dayjs(data.off_line_date).diff(
              dayjs(data.production_start_date),
              "day"
            )
        );

        const currDateDiff = dayjs(new Date()).diff(
          dayjs(data.production_start_date),
          "day"
        );

        data.units_per_day = perDayUnits;
        if (perDayUnits * currDateDiff <= data.units_order) {
          data.completed_units_as_per_date = perDayUnits * currDateDiff;
        } else data.completed_units_as_per_date = data.units_order;
      }
      currRowNode?.updateData(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ven_id = user_type === "Admin" ? "All" : vendor_id;
        const response: any = await getVendorWip(client_id, ven_id);

        setList(response.data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.response.data.message,
          serverity: "error",
        });
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      // const data: any = gridRef.current?.api?.getRowNode(currId)?.data;
      list.forEach((item: any) => {
        item.dated = dayjs(new Date()).format("YYYY-MM-DD");
      });

      const response: any = await createWip(list);

      if (response.status) {
        setSaving(false);
        setCurId(null);
        setAlert({
          open: true,
          message: "Data updated successfully",
          serverity: "success",
        });
      }
    } catch (error) {
      setSaving(false);
      setAlert({
        open: true,
        message: error.response.data.message,
        serverity: "error",
      });
    }
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
          flex: 1,
          minHeight: 0,
          width: "100%",
          "& .hover-row:hover": {
            textDecoration: "underline",
            color: (theme) => theme.palette.primary.main,
          },
          "& .ag-cell-inline-editing": {
            mt: 0.4,
            border: "none !Important",
            height: "40px !Important",
          },
          "& .ag-header-cell-content , .ag-cell-content": {
            textAlign: "center",
          },
        }}
      >
        <ERPGrid
          ref={gridRef}
          gridHeight={"100%"}
          gridWidth={"100%"}
          rowData={list}
          columnDefs={columns}
          exportToExcel={true}
          defaultColDef={defaultColDef}
          heading="WIP Data"
          getRowId={(param: any) => param.data.id}
          stopEditingWhenCellsLoseFocus={true}
          onCellEditingStopped={onCellEditingStopped}
          onCellEditingStarted={onCellEditingStarted}
          processBtn={{
            label: "Save",
            color: "success",
            onClick: handleSave,
          }}
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
        open={saving}
      >
        <CircularProgress color="inherit" size={40} />
      </Backdrop>
    </Box>
  );
}

export default WipDataVendor;
