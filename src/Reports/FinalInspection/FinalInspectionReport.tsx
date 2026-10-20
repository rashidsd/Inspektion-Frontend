import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Document,
  Text,
  Page,
  Image,
} from "@react-pdf/renderer";
import Summary from "./Summary";
import InspectionStandardAndResults from "./InspectionStandardAndResults";
import Defects from "./Defects";
import { getInspectionDetail } from "../../services/inspection/finalService";
import reportTitle from "../../assets/images/reportTitle.png";
import DefectSummary from "./DefectSummary";
import ShowImages from "./ShowImages";
import ShowImagesOrder from "./ShowImagesOrder";
import dayjs from "dayjs";

function FinalInspectionReport({ defectList }: { defectList: any }) {
  // const [defectList, setDefectList] = useState<any>([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const response: any = await getInspectionDetail("003", "001");
  //     console.log(response.data);
  //     setDefectList(response.data);
  //   }
  //   fetchData();
  // }, []);

  const style = StyleSheet.create({
    header: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
    },
    page: {
      paddingTop: 20,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },

    doc: {
      width: "100%",
      height: "100%",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 10,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });

  return (
    <Document>
      <Page size="A4" style={style.page} wrap>
        <Image
          src={reportTitle}
          style={{
            width: "100%",
            height: "95%",
            zIndex: -1,
          }}
        />
        <View
          style={{
            fontSize: 14,
            fontWeight: "bold",
            left: 20,
            top: 550,
            position: "absolute",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 5,
            }}
          >
            <Text style={{ textDecoration: "underline" }}>REPORT REF:</Text>
            <Text
              style={{
                fontSize: 12,
                marginLeft: 5,
                textDecoration: "underline",
              }}
            >
              {defectList.inspectionMaster.id}
            </Text>
          </View>
          <Text>Visit Date</Text>
          <Text style={{ marginBottom: 5, fontSize: 12 }}>
            {dayjs(defectList.inspectionMaster.dated).format("MMM DD, YYYY")}
          </Text>
          <Text
            style={{
              letterSpacing: 1.5,
              fontSize: 16,
            }}
          >
            {defectList.inspectionMaster.vendor_name}
          </Text>
          <Text>Sialkot</Text>
        </View>

        <Text style={style.header} break>
          FINAL INSPECTION REPORT
        </Text>

        <View>
          <Summary data={defectList?.inspectionMaster} />
        </View>
        <View break>
          <InspectionStandardAndResults
            passed={defectList?.inspectionResults?.find(
              (r: any) => r.descr === "Passed"
            )}
            failed={defectList?.inspectionResults?.find(
              (r: any) => r.descr === "Failed"
            )}
            reservation={defectList?.inspectionResults?.find(
              (r: any) => r.descr === "Reservation"
            )}
            resultSummary={defectList?.inspectionMaster.result_summary}
          />
        </View>
        <View break>
          {defectList?.articles_in_order.map((article: any, index: number) => (
            <>
              {defectList?.article_info
                .filter((item: any) => item.art_name === article.art_name)
                .map((defect: any, index: number) => (
                  <Defects
                    article={defect.art_name}
                    color={defect.color}
                    defectList={defectList.inspection_detail.filter(
                      (item: any) =>
                        item.art_name === defect.art_name &&
                        item.color === defect.color
                    )}
                  />
                ))}
              {defectList.defect_summary.filter(
                (item: any) => item.article === article.art_name
              ).length > 0 && (
                <View style={{ marginBottom: 10 }} break>
                  <DefectSummary
                    art_name={article.art_name}
                    summaryList={defectList.defect_summary.filter(
                      (item: any) => item.article === article.art_name
                    )}
                  />
                </View>
              )}
              <View style={{ marginBottom: 10 }}>
                <ShowImages
                  key={"articleImages"}
                  smallImages={defectList.ArticleImages.small.filter(
                    (item: any) => item.article === article.art_name
                  )}
                  largeImages={defectList.ArticleImages.large.filter(
                    (item: any) => item.article === article.art_name
                  )}
                  mediumImages={defectList.ArticleImages.medium.filter(
                    (item: any) => item.article === article.art_name
                  )}
                  article={article.art_name}
                />
              </View>
            </>
          ))}
          <View break>
            <ShowImagesOrder
              key={"orderImages"}
              smallImages={defectList.OrderImages.small}
              largeImages={defectList.OrderImages.large}
              mediumImages={defectList.OrderImages.medium}
            />
          </View>
        </View>

        <Text
          style={style.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export default FinalInspectionReport;
