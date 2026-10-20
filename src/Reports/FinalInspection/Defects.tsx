import { Text, View, StyleSheet } from "@react-pdf/renderer";
import _ from "lodash";

function Defects({
  article,
  color,
  defectList,
}: {
  article: string;
  color: string;
  defectList: any[];
}) {
  const headings = [
    "Order Quantity",
    "Presented Quantity",
    "Inspected Quantity",
    "Major Issues",
    "Minor Issues",
    "Critical Issues",
    "Carton Numbers",
  ];

  return (
    <View wrap={false}>
      <Text style={styles.mainHeading}>{`Model: ${article}`}</Text>
      <Text style={styles.subHeading}>{`Color: ${color}`}</Text>
      <View style={styles.main}>
        <Text
          style={{ flexBasis: "30%", padding: 5, backgroundColor: "lightblue" }}
        >
          Size / Qty
        </Text>
        {defectList
          .filter((defect: any) => defect.descr === "Order Quantity")[0]
          .size_detail.sort((a: any, b: any) => a.sr_no - b.sr_no)
          .map((defect: any, index: number) => (
            <Text
              style={{
                flexBasis: `${60 / defectList[0].size_detail.length}%`,
                padding: 5,
                backgroundColor: "lightblue",
                textAlign: "center",
              }}
            >
              {defect.sr_no}
            </Text>
          ))}
        <Text
          style={{
            flexBasis: "10%",
            padding: 5,
            backgroundColor: "lightblue",
            textAlign: "center",
          }}
        >
          Total
        </Text>

        {headings.map((heading: string) => (
          <>
            <Text
              style={{
                flexBasis: "30%",
                padding: 5,
                borderTop: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              {heading}
            </Text>
            {defectList
              .filter((defect: any) => defect.descr === heading)[0]
              .size_detail.sort((a: any, b: any) => a.sr_no - b.sr_no)
              .map((defect: any, index: number) => (
                <Text
                  style={{
                    flexBasis: `${60 / defectList[0].size_detail.length}%`,
                    padding: 5,
                    borderTop: "1px solid black",
                    borderRight: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {defect.qty}
                </Text>
              ))}
            <Text
              style={{
                flexBasis: "10%",
                padding: 5,
                borderTop: "1px solid black",
                textAlign: "center",
              }}
            >
              {_.sumBy(
                defectList.filter((defect: any) => defect.descr === heading)[0]
                  .size_detail,
                "qty"
              )}
            </Text>
          </>
        ))}
      </View>

      {/* {defectSummary.length > 0 && (
        <View style={{ marginBottom: 15 }} break>
          <DefectSummary
            summaryList={defectSummary}
            art_name={article}
            color={color}
          />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid black",
    marginBottom: 15,
    flexWrap: "wrap",
  },

  mainHeading: {
    fontSize: 12,
  },
  subHeading: {
    fontSize: 10,
  },
});

export default Defects;
