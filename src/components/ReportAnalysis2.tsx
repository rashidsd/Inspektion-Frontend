import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import dayjs from "dayjs";

function ReportAnalysis2({
  first,
  prv,
  cur,
  diff,
  firstDiff,
}: {
  first?: any;
  prv: any;
  cur: any;
  diff: any;
  firstDiff?: any;
}) {
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
        justifyContent={"center"}
        gap={1}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <Typography variant={"body2"} color="primary">
            {cur ? `curr : ${dayjs(cur).format("DD-MMM-YY")}` : "-"}
          </Typography>
          <Typography variant={"body2"} color="success">
            {prv ? `prev : ${dayjs(prv).format("DD-MMM-YY")}` : "-"}
          </Typography>
          <Typography variant={"body2"} color="error">
            {first ? `first : ${dayjs(first).format("DD-MMM-YY")}` : "-"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            "& .MuiTypography-root": {
              px: 0.3,
            },
          }}
        >
          {diff != 0 && (
            <Typography
              sx={{
                borderRadius: 0.5,
                bgcolor: (theme) =>
                  diff > 0
                    ? theme.palette.error.main
                    : diff < 0
                    ? theme.palette.success.main
                    : null,
                color: "white",
                fontSize: "0.40rem",
                py: 0.1,
                px: 0.2,
              }}
              variant={"body2"}
            >
              {diff}
            </Typography>
          )}
          {firstDiff != 0 && (
            <Typography
              sx={{
                borderRadius: 0.5,
                bgcolor: (theme) =>
                  firstDiff > 0
                    ? theme.palette.error.main
                    : firstDiff < 0
                    ? theme.palette.success.main
                    : null,
                color: "white",
                fontSize: "0.40rem",
                py: 0.1,
                px: 0.2,
              }}
              variant={"body2"}
            >
              {firstDiff}
            </Typography>
          )}

          {/* {diff > 0 ? (
            <ArrowUpwardIcon sx={{ fontSize: 15, flex: 1 }} color={"error"} />
          ) : diff == 0 || diff === null ? null : (
            <ArrowDownwardIcon
              sx={{ fontSize: 15, flex: 1 }}
              color={"success"}
            />
          )} */}
        </Box>
      </Box>
    </>
  );
}

export default ReportAnalysis2;
