import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { getAnalysisByArticle } from "../../services/inspection/final_analysisService";
import { useFinalInspectionStore } from "../../store/final_inspection_store";
import { tableHeaderRowSx } from "../../util/tableStyles";

function Show_Inspection_Analysis({
  inspection_no,
  article,
}: {
  inspection_no: string;
  article: string;
}) {
  const [analysisList, setAnalysisList] = useState<any[]>([]);
  const total_analysis = useFinalInspectionStore(
    (state) => state.total_analysis
  );

  const fetchData = async () => {
    try {
      const response: any = await getAnalysisByArticle(inspection_no, article);
      setAnalysisList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [total_analysis]);

  return (
    <Box>
      <Typography
        textAlign={"center"}
        variant="body1"
      >{`Frequency & Nature of Defects in ${article}`}</Typography>
      <Box sx={{ px: 10, my: 2 }}>
        <TableContainer>
          <Table aria-label="vendor contacts" size="small">
            <TableHead>
              <TableRow sx={tableHeaderRowSx}>
                <TableCell>Color</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Defect Position</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analysisList &&
                analysisList.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.color}</TableCell>
                    <TableCell>{row.size}</TableCell>
                    <TableCell>{row.defect_position}</TableCell>
                    <TableCell>{row.detail}</TableCell>
                    <TableCell>{row.frequency}</TableCell>
                    <TableCell>
                      {row.category.split(" ")[0].toUpperCase()}
                    </TableCell>
                    <TableCell>{row.action}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Show_Inspection_Analysis;
