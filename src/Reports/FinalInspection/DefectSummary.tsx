import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { first } from "lodash";

function DefectSummary({
  art_name,
  summaryList,
}: {
  art_name: string;

  summaryList: any[];
}) {
  return (
    <>
      <Text
        style={{
          fontSize: 12,
          marginTop: 10,
          marginBottom: 10,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >{`Frequency & nature of defects in ${art_name} `}</Text>
      <View style={styles.main}>
        <Text style={[styles.topCol, { backgroundColor: "lightblue" }]}>
          Color
        </Text>
        <Text style={[styles.firstCol, { backgroundColor: "lightblue" }]}>
          Size
        </Text>
        <Text style={[styles.secondCol, { backgroundColor: "lightblue" }]}>
          Defect Position
        </Text>
        <Text style={[styles.thirdCol, { backgroundColor: "lightblue" }]}>
          Detail
        </Text>
        <Text style={[styles.fourthCol, { backgroundColor: "lightblue" }]}>
          Freq.
        </Text>
        <Text style={[styles.fifthCol, { backgroundColor: "lightblue" }]}>
          Category
        </Text>
        <Text style={[styles.sixthCol, { backgroundColor: "lightblue" }]}>
          Action
        </Text>
        {summaryList.map((summary: any, index: number) => (
          <>
            <Text style={[styles.topCol, { borderTop: "1px solid black" }]}>
              {summary.color}
            </Text>
            <Text style={[styles.firstCol, { borderTop: "1px solid black" }]}>
              {summary.size}
            </Text>
            <Text style={[styles.secondCol, { borderTop: "1px solid black" }]}>
              {summary.defect_position}
            </Text>
            <Text style={[styles.thirdCol, { borderTop: "1px solid black" }]}>
              {summary.detail}
            </Text>
            <Text style={[styles.fourthCol, { borderTop: "1px solid black" }]}>
              {summary.frequency}
            </Text>
            <Text style={[styles.fifthCol, { borderTop: "1px solid black" }]}>
              {" "}
              {summary.category.split(" ")[0].toUpperCase()}
            </Text>
            <Text style={[styles.sixthCol, { borderTop: "1px solid black" }]}>
              {summary.action}
            </Text>
          </>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    border: "1px solid black",
  },
  topCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "18%",
  },

  firstCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "7%",
  },
  secondCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "15%",
  },
  thirdCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "20%",
  },
  fourthCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "10%",
  },
  fifthCol: {
    borderRight: "1px solid black",
    padding: 5,
    textAlign: "center",
    flexBasis: "15%",
  },
  sixthCol: {
    padding: 5,
    textAlign: "center",
    flexBasis: "15%",
  },
});

export default DefectSummary;
