import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Edit from "@mui/icons-material/Edit";
import { tableHeaderRowSx } from "../../util/tableStyles";
import DoneIcon from "@mui/icons-material/Done";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import _, { set } from "lodash";
import ERPSnakBar from "../../components/ERPSnakBar";
import TakePicture from "../TakePicture";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Inspection_Analysis from "./Inspection_Analysis";
import Show_Inspection_Images from "./Show_Inspection_Images";
import { updateInspectionDetail } from "../../services/inspection/finalService";
import { getPicturesAllArticles } from "../../services/inspection/inspection_picture_Service";
import { useFinalInspectionStore } from "../../store/final_inspection_store";
import Show_Inspection_Analysis from "./Show_Inspection_Analysis";

function ArticleInfo({
  inspectionInfo,
  order_no,
  inspection_no,
}: {
  inspectionInfo: any;
  order_no: string;
  inspection_no: string;
}) {
  const [takePicture, setTakePicture] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [distinctArticles, setDistinctArticles] = useState<any>([]);
  const [orderImageList, setOrderImageList] = useState<any[]>([]);

  const total_article_images = useFinalInspectionStore(
    (state) => state.total_article_images
  );

  useEffect(() => {
    const distinctArticles = _.uniqBy(inspectionInfo.article_info, "art_name");
    setDistinctArticles(distinctArticles);
  }, [inspectionInfo]);

  useEffect(() => {
    const fetchData = async () => {
      const response: any = await getPicturesAllArticles(order_no);
      if (response.data) {
        setOrderImageList(response.data);
      }
    };
    fetchData();
  }, [total_article_images]);

  const handleTakePicture = (currArticle: string) => {
    setArticle(currArticle);
    setTakePicture(true);
  };

  return (
    <Box>
      {distinctArticles.map((disArticle: any, index: number) => (
        <>
          <Typography variant="body1">
            {` Model: ${disArticle.art_name}`}
            <Button
              sx={{ ml: 1 }}
              onClick={() => handleTakePicture(disArticle.art_name)}
              variant="contained"
              color="warning"
              size="small"
            >
              Take Picture{" "}
            </Button>
          </Typography>
          {inspectionInfo.article_info &&
            inspectionInfo.article_info
              .filter((f: any) => f.art_name === disArticle.art_name)
              .map((article: any, index: number) => (
                <>
                  <Typography variant="body2">
                    {" "}
                    {` Color: ${article.color}`}
                  </Typography>
                  <Box sx={{ pb: 3 }}>
                    <ArticleSizes
                      order_no={order_no}
                      art_name={article.art_name}
                      color={article.color}
                      inspection_no={inspection_no}
                      inspectionDetail={inspectionInfo.inspection_detail.filter(
                        (insp: any) =>
                          insp.art_name === article.art_name &&
                          insp.color === article.color
                      )}
                    />
                  </Box>
                </>
              ))}
          <Show_Inspection_Analysis
            inspection_no={inspection_no}
            article={disArticle.art_name}
          />
          <Show_Inspection_Images
            descr={`Pictorial refrence of ${disArticle.art_name}`}
            imageList={orderImageList.filter(
              (f: any) => f.article === disArticle.art_name
            )}
          />
        </>
      ))}

      <Backdrop
        open={takePicture}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <TakePicture
          key={new Date().toDateString()}
          params={{
            onClose: setTakePicture,
            inspection_no,
            order_no,
            article,
            isClose: takePicture,
          }}
        />
      </Backdrop>
    </Box>
  );
}

function ArticleSizes({
  inspection_no,
  order_no,
  art_name,
  color,
  inspectionDetail,
}: {
  inspection_no: string;
  order_no: string;
  art_name: string;
  color: string;
  inspectionDetail: any[];
}) {
  const [editrow, setEditRow] = useState<string | null>(null);
  const [tableHeader, setTableHeader] = useState<any>([]);
  const [inspDetail, setInspDetail] = useState<any[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currObj, setCurrObj] = useState<any>({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  useEffect(() => {
    const header = inspectionDetail.filter(
      (f) => f.descr === "Order Quantity"
    )[0];
    setTableHeader(header);
    setInspDetail(inspectionDetail);
  }, [inspectionDetail]);

  const handleChangeInspectionQty = (e: any, size: any) => {
    const newInspectionDetail = inspDetail.map((insp) => {
      if (insp.descr === editrow) {
        const newSizes = insp.size_detail.map((s: any) => {
          if (s.size === size) {
            return { ...s, qty: e.target.value };
          }
          return s;
        });
        return { ...insp, size_detail: newSizes };
      }
      return insp;
    });
    setInspDetail(newInspectionDetail);
  };

  const handleTotal = (sizes: any[]) => {
    const sum = sizes.reduce((acc, curr) => acc + Number(curr.qty), 0);
    return sum == 0 ? "-" : sum;
  };

  const handleEndEdit = async () => {
    try {
      const editRecord = inspDetail.filter(
        (f) =>
          f.descr === editrow && f.art_name === art_name && f.color === color
      )[0];
      setEditRow(null);
      const updateRecord = editRecord.size_detail.map((size: any) => {
        return {
          descr: editrow,
          order_no: order_no,
          article: art_name,
          color: color,
          size: size.size,
          qty: size.qty,
          inspection_no: inspection_no,
        };
      });

      const response: any = await updateInspectionDetail(updateRecord);
      if (response.data) {
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

  const handleShowAnalysis = (obj: any) => {
    setCurrObj(obj);
    setShowAnalysis(true);
  };

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={tableHeaderRowSx}>
              <TableCell>Size/Quantity</TableCell>
              {tableHeader?.size_detail
                ?.map((size: any, index: number) => (
                  <TableCell>{size.size}</TableCell>
                ))
                .sort((a: any, b: any) => Number(a.sr_no) - Number(b.sr_no))}
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inspDetail.map((insp, index) => (
              <TableRow>
                <>
                  <TableCell>{insp.descr} </TableCell>
                  {insp?.size_detail
                    ?.map((size: any, index: number) => (
                      <TableCell>
                        {editrow === insp?.descr ? (
                          <TextField
                            sx={{
                              "& .MuiInputBase-root": {
                                fontSize: 12,
                                padding: 0,
                                width: 60,
                                height: 30,
                              },
                            }}
                            value={size.qty}
                            onChange={(e) =>
                              handleChangeInspectionQty(e, size?.size)
                            }
                          />
                        ) : (
                          <Box
                            component={"div"}
                            onClick={() => {
                              const obj = {
                                inspection_no: inspection_no,
                                order_no: order_no,
                                article: art_name,
                                color: color,
                                category: insp.descr,
                                size: size.size,
                                showAnalysis,
                              };
                              handleShowAnalysis(obj);
                            }}
                            sx={{ cursor: "pointer" }}
                          >
                            {size.qty > 0 ? size.qty : "-"}
                          </Box>
                        )}
                      </TableCell>
                    ))
                    .sort(
                      (a: any, b: any) => Number(a.sr_no) - Number(b.sr_no)
                    )}
                  <TableCell>{handleTotal(insp?.size_detail)}</TableCell>

                  <TableCell>
                    <Box
                      component="div"
                      display="flex"
                      justifyContent="flex-start"
                    >
                      {editrow === insp?.descr ? (
                        <IconButton onClick={handleEndEdit} size="small">
                          <DoneIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      ) : (
                        insp?.descr !== "Order Quantity" && (
                          <IconButton
                            onClick={() => setEditRow(insp.descr)}
                            size="small"
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                        )
                      )}
                    </Box>
                  </TableCell>
                </>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ERPSnakBar
          open={alert.open}
          onClose={() => setAlert({ open: false, message: "", serverity: "" })}
          serverity={alert.serverity}
          message={alert.message}
        />
      </TableContainer>
      <Backdrop
        open={showAnalysis}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Inspection_Analysis obj={currObj} onClose={setShowAnalysis} />
      </Backdrop>
    </>
  );
}

export default ArticleInfo;
