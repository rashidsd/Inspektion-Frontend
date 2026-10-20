import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-material.css";
import { useCallback, forwardRef } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";

ModuleRegistry.registerModules([AllCommunityModule]);

const ERPGrid = forwardRef<AgGridReact, React.PropsWithChildren<any>>(
  (
    { gridHeight, gridWidth, exportToExcel, heading, processBtn, ...gridProps },
    ref
  ) => {
    const onBtnExport = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.api.exportDataAsCsv();
      }
    }, []);

    return (
      <Box
        className="ag-theme-material"
        sx={{
          width: gridWidth || "100%",
          height: gridHeight || "80vh",
          display: "flex",
          flexDirection: "column",
          "--ag-background-color": (theme) => theme.palette.background.paper,
          "--ag-foreground-color": (theme) => theme.palette.text.primary,
          "--ag-header-background-color": (theme) =>
            theme.palette.action.hover,
          "--ag-header-foreground-color": (theme) => theme.palette.text.primary,
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
            fontSize: "0.7rem",
          },
          "& .ag-cell": { paddingY: "4px" },
          "& .ag-row-focus": {
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.16),
            fontWeight: "bold",
          },
        }}
      >
        <Box sx={{ flexShrink: 0, mb: 1 }}>
          {heading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 0.5,
                py: 0.75,
                mb: processBtn || exportToExcel ? 1 : 0,
                borderBottom: (theme) =>
                  `2px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 22,
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  flexShrink: 0,
                }}
              />
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                {heading}
              </Typography>
            </Box>
          )}
          {(processBtn || exportToExcel) && (
            <Box
              display={"flex"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              flexWrap="wrap"
              gap={1}
            >
              {processBtn && (
                <Button
                  onClick={processBtn.onClick}
                  color={processBtn.color}
                  sx={{ width: "160px" }}
                  variant="outlined"
                >
                  {processBtn.label}
                </Button>
              )}
              {exportToExcel && (
                <Button
                  variant="outlined"
                  onClick={onBtnExport}
                  sx={{ width: "160px" }}
                >
                  Export to Excel
                </Button>
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
          <AgGridReact ref={ref} {...gridProps} />
        </Box>
      </Box>
    );
  }
);

export default ERPGrid;
