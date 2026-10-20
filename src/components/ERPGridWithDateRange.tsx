import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-material.css";
import { useCallback, forwardRef } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

ModuleRegistry.registerModules([AllCommunityModule]);

const ERPGridWithDateRange = forwardRef<
  AgGridReact,
  React.PropsWithChildren<any>
>(
  (
    {
      gridHeight,
      gridWidth,
      exportToExcel,
      heading,
      processBtn,
      getData,
      rowData,
      ...gridProps
    },
    ref
  ) => {
    const onBtnExport = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.api.exportDataAsCsv();
      }
    }, []);

    const [fromDate, setFromDate] = useState<string | null>(
      dayjs(new Date()).subtract(18, "months").format("YYYY-MM-DD")
    );
    const [toDate, setToDate] = useState<string | null>(
      dayjs(new Date()).format("YYYY-MM-DD")
    );
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>(rowData);

    const refreshData = async () => {
      try {
        if (!getData) return;
        setLoading(true);
        const result = await getData(fromDate, toDate);
        if (result.data) {
          setData(result.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    return (
      <>
        <Box
          className="ag-theme-material"
          sx={{
            width: gridWidth || "100%",
            height: gridHeight || "80vh",
            "--ag-background-color": (theme) => theme.palette.background.paper,
            "--ag-foreground-color": (theme) => theme.palette.text.primary,
            "--ag-header-background-color": (theme) =>
              theme.palette.action.hover,
            "--ag-header-foreground-color": (theme) =>
              theme.palette.text.primary,
            "--ag-border-color": (theme) => theme.palette.divider,
            "--ag-row-border-color": (theme) => theme.palette.divider,
            "--ag-odd-row-background-color": (theme) =>
              theme.palette.action.hover,
            "--ag-row-hover-color": (theme) => theme.palette.action.hover,
            "--ag-selected-row-background-color": (theme) =>
              alpha(theme.palette.primary.main, 0.16),
            "& .ag-header-row": { bgcolor: "action.hover" },
            "& .ag-row-odd": { bgcolor: "action.hover" },
            "& .ag-row-hover": {
              cursor: "pointer",
              fontWeight: "bold",
            },
            "& .ag-row-focus": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.16),
              fontWeight: "bold",
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1}
              sx={{ mb: 1, pr: 1 }}
            >
              <DatePicker
                label="From Date"
                format="DD-MM-YYYY"
                sx={{}}
                value={dayjs(fromDate)}
                onChange={(newValue) => {
                  setFromDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
              <DatePicker
                label="To Date"
                format="DD-MM-YYYY"
                sx={{}}
                value={dayjs(toDate)}
                onChange={(newValue) => {
                  setToDate(dayjs(newValue).format("YYYY-MM-DD"));
                }}
              />
              <Button variant="outlined" onClick={refreshData}>
                Get Data
              </Button>
              {exportToExcel && (
                <Button variant="outlined" onClick={onBtnExport}>
                  Export to Excel
                </Button>
              )}
            </Box>
          </LocalizationProvider>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            {processBtn && (
              <Button
                onClick={processBtn.onClick}
                color={processBtn.color}
                sx={{ mb: 1, mr: 1, width: "160px" }}
                variant="outlined"
              >
                {processBtn.label}
              </Button>
            )}

            {heading && (
              <Typography
                sx={{ flex: 1, fontWeight: "bold" }}
                textAlign={"center"}
              >
                {heading}
              </Typography>
            )}
          </Box>
          <AgGridReact ref={ref} rowData={data} {...gridProps} />
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
);

export default ERPGridWithDateRange;
