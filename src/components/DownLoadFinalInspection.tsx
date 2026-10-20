import { useState, useEffect } from "react";
import { getInspectionDetail } from "../services/inspection/finalService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FinalInspectionReport from "../Reports/FinalInspection/FinalInspectionReport";
import { Button } from "@mui/material";

function DownLoadFinalInspection({ orderNo, inspectionNo }: any) {
  const [defectList, setDefectList] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      const response: any = await getInspectionDetail(orderNo, inspectionNo);
      setDefectList(response.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <PDFDownloadLink
        document={<FinalInspectionReport defectList={defectList} />}
        fileName="FinalInspection.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : <Button>Download PDF</Button>
        }
      </PDFDownloadLink>
    </div>
  );
}

export default DownLoadFinalInspection;
