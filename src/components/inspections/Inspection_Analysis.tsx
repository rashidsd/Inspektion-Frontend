import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid2";
import { tableHeaderRowSx } from "../../util/tableStyles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import { useState, useEffect, useRef } from "react";
import {
  addAnalysis,
  getAnalysisByArticleTypeAndSize,
  deleteAnalysis,
} from "../../services/inspection/final_analysisService";
import { useFinalInspectionStore } from "../../store/final_inspection_store";
import TakePictureDefect from "../TakePictureDefect";

function Inspection_Analysis({
  obj,
  onClose,
}: {
  obj: any;
  onClose: (pram: boolean) => void;
}) {
  const [analysis, setAnalysis] = useState<any>({});
  const [analysisList, setAnalysisList] = useState<any[]>([]);
  const defectRef = useRef<any>(null);
  const updateAnalysisTotal = useFinalInspectionStore(
    (state) => state.updateAnalysisTotal
  );

  const fetchData = async () => {
    try {
      const response: any = await getAnalysisByArticleTypeAndSize(
        obj.inspection_no,
        obj.category,
        obj.article,
        obj.color,
        obj.size
      );

      setAnalysisList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      defectRef!.current!.focus();
    }, 1000);
  }, [defectRef]);

  useEffect(() => {
    fetchData();
  }, [obj]);

  const handleChangeValue = (e: any) => {
    setAnalysis({ ...analysis, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response: any = await addAnalysis({
        ...analysis,
        inspection_no: obj.inspection_no,
        category: obj.category,
        article: obj.article,
        color: obj.color,
        size: obj.size,
      });

      if (response.data) {
        fetchData();
        setAnalysis({
          defect_position: "",
          detail: "",
          frequency: "",
          action: "Reported",
        });
        defectRef!.current!.focus();
        updateAnalysisTotal(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response: any = await deleteAnalysis(id);
      if (response.data) {
        fetchData();
        updateAnalysisTotal(response.data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setAnalysis({
      defect_position: "",
      detail: "",
      frequency: "",
      action: "Reported",
    });
    onClose(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        margin: 2,
        padding: 1,
        marginBottom: 2,
      }}
    >
      <Box sx={{ display: "flex", padding: 0.5 }}>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "center", sm: "start" },
                flexDirection: "column",
                "& .MuiInputBase-root": {
                  marginBottom: 0.5,
                },
              }}
            >
              <Typography variant="h6">{obj.category}</Typography>
              <Typography variant="body2">{`Article: ${obj.article}`}</Typography>
              <Typography variant="body2">{`Color: ${obj.color}`}</Typography>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="body2"
              >{`Size: ${obj.size}`}</Typography>

              <Box display={"flex"} flexDirection={"column"} width={300}>
                <TextField
                  name="defect_position"
                  value={analysis.defect_position}
                  onChange={handleChangeValue}
                  label="Defect Position"
                  variant="outlined"
                  size="small"
                  inputRef={defectRef}
                />

                <TextField
                  value={analysis.detail}
                  name="detail"
                  onChange={handleChangeValue}
                  label="Detail"
                  variant="outlined"
                  size="small"
                />

                <TextField
                  value={analysis.frequency}
                  name="frequency"
                  onChange={handleChangeValue}
                  type="number"
                  label="Frequency"
                  variant="outlined"
                  size="small"
                />

                <Select
                  name="action"
                  onChange={handleChangeValue}
                  size="small"
                  defaultValue={"Reported"}
                >
                  <MenuItem value={"Reported"}>Reported</MenuItem>
                  <MenuItem value={"Repaired"}>Repaired</MenuItem>
                  <MenuItem value={"Accepted"}>Accepted</MenuItem>
                </Select>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TakePictureDefect
                params={{ ...obj, detail: analysis.detail }}
                onClose={onClose}
                saveAnalysis={handleSave}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <TableContainer>
        <Table aria-label="inspection analysis" size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowSx}>
              <TableCell>Defect Position</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analysisList &&
              analysisList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.defect_position}</TableCell>
                  <TableCell>{row.detail}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={async () => {
                        handleDelete(row.id);
                      }}
                    >
                      <Delete sx={{ fontSize: 19 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Inspection_Analysis;
