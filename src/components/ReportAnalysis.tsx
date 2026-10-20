import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useEffect, useState, useCallback } from "react";

function ReportAnalysis(params: any) {
  const [values, setValues] = useState<any>({
    cur: null,
    prv: null,
    diff: 0,
  });

  const getValues = useCallback(() => {
    if (params.field_name === "material_order_date") {
      console.log(params.data, "in report analysis");
      return {
        cur: params.data.material_order_date,
        prv: params.data.s_material_order_date,
        diff: params.data.material_diff,
      };
    } else if (params.field_name === "material_inhouse_date") {
      return {
        cur: params.data.material_inhouse_date,
        prv: params.data.s_material_inhouse_date,
        diff: params.data.material_inhouse_diff,
      };
    } else if (params.field_name === "sample_start_date") {
      return {
        cur: params.data.sample_start_date,
        prv: params.data.s_sample_start_date,
        diff: params.data.sample_start_date_diff,
      };
    } else if (params.field_name === "sample_send_date") {
      return {
        cur: params.data.sample_send_date,
        prv: params.data.s_sample_send_date,
        diff: params.data.sample_send_date_diff,
      };
    } else if (params.field_name === "sample_approval_date") {
      return {
        cur: params.data.sample_approval_date,
        prv: params.data.s_sample_approval_date,
        diff: params.data.sample_approval_date_diff,
      };
    } else if (params.field_name === "production_start_date") {
      return {
        cur: params.data.production_start_date,
        prv: params.data.s_production_start_date,
        diff: params.data.production_start_date_diff,
      };
    } else if (params.field_name === "top_send_date") {
      return {
        cur: params.data.top_send_date,
        prv: params.data.s_top_send_date,
        diff: params.data.top_send_date_diff,
      };
    } else if (params.field_name === "off_line_date") {
      return {
        cur: params.data.off_line_date,
        prv: params.data.s_off_line_date,
        diff: params.data.off_line_date_diff,
      };
    } else if (params.field_name === "qa_complete_date") {
      return {
        cur: params.data.qa_complete_date,
        prv: params.data.s_qa_complete_date,
        diff: params.data.qa_complete_date_diff,
      };
    } else if (params.field_name === "finish_packing_date") {
      return {
        cur: params.data.finish_packing_date,
        prv: params.data.s_finish_packing_date,
        diff: params.data.finish_packing_date_diff,
      };
    } else if (params.field_name === "estimated_xfactory_date") {
      return {
        cur: params.data.estimated_xfactory_date,
        prv: params.data.s_estimated_xfactory_date,
        diff: params.data.estimated_xfactory_date_diff,
      };
    } else return null;
  }, [params.data]);

  useEffect(() => {
    setValues(getValues);
  }, []);

  return (
    <>
      <Box
        sx={{
          "& .MuiTypography-root": {
            fontSize: "0.70rem",
            mt: 0.3,
          },
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={1}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <Typography variant={"body2"}>
            {values.cur ? `cur : ${values.cur}` : "-"}
          </Typography>
          <Typography variant={"body2"}>
            {values.prv ? `prv : ${values.prv}` : "-"}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "space-around",
            flexDirection: "column",
          }}
        >
          {values.diff != 0 && (
            <Typography
              sx={{
                borderRadius: 0.5,
                bgcolor: (theme) =>
                  values.diff > 0
                    ? theme.palette.error.main
                    : values.diff < 0
                    ? theme.palette.success.main
                    : "primary.main",
                color: "white",
                fontSize: "0.60rem",
                py: 0.1,
                px: 0.2,
              }}
              variant={"body2"}
            >
              {values.diff}
            </Typography>
          )}

          {values.diff > 0 ? (
            <ArrowUpwardIcon sx={{ fontSize: 15, flex: 1 }} color={"error"} />
          ) : values.diff == 0 || values.diff === null ? null : (
            <ArrowDownwardIcon
              sx={{ fontSize: 15, flex: 1 }}
              color={"success"}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default ReportAnalysis;
