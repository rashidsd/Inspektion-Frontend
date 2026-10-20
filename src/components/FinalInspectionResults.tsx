import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {
  saveInspectionResults,
  getInspectionResults,
} from "../services/inspection/finalService";
import { inspectionResults } from "../customTypes/customTypes";
import ERPSnakBar from "../components/ERPSnakBar";
import { getTableHeaderBg } from "../util/tableStyles";

import { useEffect, useState } from "react";

function FinalInspectionResults({ inspection_no }: { inspection_no?: string }) {
  const [inspectionResults, setInspectionResults] = useState<any[]>([]);
  const [results, setResults] = useState<inspectionResults[]>([
    {
      id: 0,
      inspection_no: "",
      descr: "Passed",
      workmanship: "",
      confirmity: "",
      measurment: "",
      test: "",
      packing: "",
    },
    {
      id: 0,
      inspection_no: "",
      descr: "Failed",
      workmanship: "",
      confirmity: "",
      measurment: "",
      test: "",
      packing: "",
    },
    {
      id: 0,
      inspection_no: "",
      descr: "Reservation",
      workmanship: "",
      confirmity: "",
      measurment: "",
      test: "",
      packing: "",
    },
  ]);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await getInspectionResults(inspection_no);
      results.map((result) => {
        const data = response.data.find(
          (item: inspectionResults) => item.descr === result.descr
        );
        if (data) {
          result.id = data.id;
          result.inspection_no = data.inspection_no;
          result.workmanship = data.workmanship;
          result.confirmity = data.confirmity;
          result.measurment = data.measurment;
          result.test = data.test;
          result.packing = data.packing;
        }
      });
      setInspectionResults(results);
    };

    fetchData();
  }, [inspection_no]);

  const handleSave = async (result: inspectionResults) => {
    try {
      const data = {
        id: result.id,
        inspection_no: inspection_no ? inspection_no : "",
        descr: result.descr,
        workmanship: result.workmanship,
        confirmity: result.confirmity,
        measurment: result.measurment,
        test: result.test,
        packing: result.packing,
      };
      const response: any = await saveInspectionResults(data);
      if (response.status) {
        // set the id
        const newResults = inspectionResults.map((item: any) => {
          if (item.descr === result.descr) {
            item.id = response.data.id;
          }
          return item;
        });
        setInspectionResults(newResults);
        setAlert({
          open: true,
          message: "Record updated successfully",
          serverity: "success",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.msg
          : error.message.toString(),
        serverity: "error",
      });
    }
  };

  const handleValueChange = (descr: string, field: string, value: string) => {
    const newResults = inspectionResults.map((result: any) => {
      if (result.descr === descr) {
        result[field] = value;
      }
      return result;
    });
    setInspectionResults(newResults);
  };

  return (
    <>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => getTableHeaderBg(theme),
                "& .MuiTableCell-root": {
                  fontWeight: "bold",
                },
              }}
            >
              <TableCell>Descrsiption</TableCell>
              <TableCell>Workmanship</TableCell>
              <TableCell>Confirmity</TableCell>
              <TableCell>Measurment</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Packing</TableCell>
              <TableCell>Save</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inspectionResults.map((result: inspectionResults) => (
              <TableRow key={result.descr}>
                <TableCell>
                  <Typography variant="body1">{result.descr}</Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={result.workmanship}
                    onChange={(e) =>
                      handleValueChange(
                        result.descr,
                        "workmanship",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={result.confirmity}
                    onChange={(e) =>
                      handleValueChange(
                        result.descr,
                        "confirmity",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={result.measurment}
                    onChange={(e) =>
                      handleValueChange(
                        result.descr,
                        "measurment",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={result.test}
                    onChange={(e) =>
                      handleValueChange(result.descr, "test", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={result.packing}
                    onChange={(e) =>
                      handleValueChange(result.descr, "packing", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleSave(result)}>
                    <SaveIcon color="success" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />
    </>
  );
}

export default FinalInspectionResults;
