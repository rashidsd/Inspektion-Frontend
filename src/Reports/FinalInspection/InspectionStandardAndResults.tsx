import { Text, StyleSheet, View } from "@react-pdf/renderer";

function InspectionStandardAndResults({
  passed,
  failed,
  reservation,
  resultSummary,
}: {
  passed: any;
  failed: any;
  reservation: any;
  resultSummary?: string;
}) {
  return (
    <>
      <Text style={{ ...styles.title }}>Inspection Standards</Text>
      <View style={styles.main}>
        <Text style={styles.firstCol}>
          <>Inspection Type</>
        </Text>
        <Text style={styles.secondCol}>
          <>Production Inspection</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Sample Standard</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>ISO 2859-1</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Sampling Level</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>At Random</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>AQL for Critical Defect</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>-</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>AQL for Major Defect</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>1.0</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>AQL for Minor Defect</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>2.5</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Sampling Size for Critical/Majon/Minor</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>Pcs/Pairs</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Number of Inspected Pieces</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>Pcs/Pairs</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Number of Inspected Cartons</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>N/A</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>Sealed Cartons by IS tape</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>Not Required</>
        </Text>
      </View>

      <Text style={{ ...styles.title, marginTop: 10 }}>Inspection Results</Text>
      <View style={styles.main}>
        <Text style={{ ...styles.firtColR, fontWeight: "bold" }}>
          <></>
        </Text>
        <Text style={{ ...styles.secondColR, fontWeight: "bold" }}>
          <>Workmanship</>
        </Text>
        <Text style={{ ...styles.secondColR, fontWeight: "bold" }}>
          <>Confirmity</>
        </Text>
        <Text style={{ ...styles.secondColR, fontWeight: "bold" }}>
          <>Measurment</>
        </Text>
        <Text style={{ ...styles.secondColR, fontWeight: "bold" }}>
          <>Test</>
        </Text>
        <Text style={{ ...styles.secondColR, fontWeight: "bold" }}>
          <>Packing</>
        </Text>

        <Text
          style={{
            ...styles.firtColR,
            ...styles.additionStyle,
            fontWeight: "bold",
          }}
        >
          <>Passed</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{passed?.workmanship}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{passed?.confirmity}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{passed?.measurment}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{passed?.test}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{passed?.packing}</>
        </Text>

        <Text
          style={{
            ...styles.firtColR,
            ...styles.additionStyle,
            fontWeight: "bold",
          }}
        >
          <>Failed</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{failed?.workmanship}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{failed?.confirmity}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{failed?.measurment}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{failed?.test}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{failed?.packing}</>
        </Text>

        <Text
          style={{
            ...styles.firtColR,
            ...styles.additionStyle,
            fontWeight: "bold",
          }}
        >
          <>Reservation</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{reservation?.workmanship}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{reservation?.confirmity}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{reservation?.measurment}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{reservation?.test}</>
        </Text>
        <Text style={{ ...styles.secondColR, ...styles.additionStyle }}>
          <>{reservation?.packing}</>
        </Text>
        <Text
          wrap={true}
          style={{
            borderTop: "1px solid black",
            padding: 5,
            lineHeight: 1.1,
            flexBasis: "100%",
          }}
        >
          {resultSummary}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    border: "1px solid black",
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 16,
    padding: 3,
    border: "1px solid black",
    marginBottom: 3,
    backgroundColor: "lightblue",
  },
  firstCol: {
    flexBasis: "50%",
    borderRight: "1px solid balck",
    padding: 7,
    fontWeight: "bold",
  },
  secondCol: {
    flexBasis: "50%",
    borderRight: "1px solid balck",
    padding: 7,
  },

  additionStyle: {
    borderTop: "1px solid black",
  },
  firtColR: {
    flexBasis: "20%",
    borderRight: "1px solid balck",
    padding: 7,
  },
  secondColR: {
    flexBasis: "16%",
    borderRight: "1px solid balck",
    padding: 7,
  },
});

export default InspectionStandardAndResults;
