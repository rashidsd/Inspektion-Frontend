import { Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

function Summary({ data }: { data: any }) {
  return (
    <>
      <Text style={styles.title}>Overview of the Job</Text>
      <View style={styles.main}>
        <Text style={{ ...styles.firstCol, ...styles.additionStyleFirtRow }}>
          <>PO No</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyleFirtRow }}>
          <>Factory Order No</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyleFirtRow }}>
          <>Order Placement Date</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyleFirtRow }}>
          <>Inspection Type</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>{data.po_no}</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>{data.factory_order_no}</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyle }}>
          <>{dayjs(data.po_date).format("MM-DD-YYYY")}</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyle }}>
          <>Final Inspection</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyleHeading }}>
          <>Total Order Qty</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyleHeading }}>
          <>Packed Qty</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyleHeading }}>
          <>Presented Qty</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyleHeading }}>
          <>Packed Qty</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>{data.order_qty}</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>{data.presented_qty}</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyle }}>
          <>-</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyle }}>
          <>{data.packed_qty}</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyleHeading }}>
          <>Total Number of Articles</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyleHeading }}>
          <>Colors</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyleHeading }}>
          <>Reference Sample</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyleHeading }}>
          <></>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>{data.article_with_colors}</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>{data.article_colors}</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyle }}>
          <>{data.reference_sample}</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyle }}>
          <></>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyleHeading }}>
          <>Factory Cooporation</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyleHeading }}>
          <>Factory Organization</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyleHeading }}>
          <>Availibility of Spectial Inspection Room</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyleHeading }}>
          <>Inspection Team Opinion</>
        </Text>

        <Text style={{ ...styles.firstCol, ...styles.additionStyle }}>
          <>{data.factory_cooporation}</>
        </Text>
        <Text style={{ ...styles.secondCol, ...styles.additionStyle }}>
          <>{data.factory_organization}</>
        </Text>
        <Text style={{ ...styles.thirdCol, ...styles.additionStyle }}>
          <>{data.inspection_room}</>
        </Text>
        <Text style={{ ...styles.fourthCol, ...styles.additionStyle }}>
          <>{data.inspection_team_opinion}</>
        </Text>
      </View>

      <View style={{ ...styles.main, marginTop: 10 }}>
        <Text
          style={{
            ...styles.firstCol,
            ...styles.additionStyleFirtRow,
            backgroundColor: "lightblue",
          }}
        >
          <>Name of Inspector</>
        </Text>
        <Text
          style={{
            ...styles.secondCol,
            ...styles.additionStyleFirtRow,
            backgroundColor: "lightblue",
          }}
        >
          <>Prepared By</>
        </Text>
        <Text
          style={{
            ...styles.thirdCol,
            ...styles.additionStyleFirtRow,
            backgroundColor: "lightblue",
          }}
        >
          <>Verified By</>
        </Text>
        <Text
          style={{
            ...styles.fourthCol,
            ...styles.additionStyleFirtRow,
            backgroundColor: "lightblue",
          }}
        >
          <>Approved By</>
        </Text>

        <Text
          style={[
            { ...styles.firstCol, ...styles.additionStyle },
            { borderBottom: "1px solid black" },
          ]}
        >
          <>{data.inspector_name}</>
        </Text>
        <Text
          style={[
            { ...styles.secondCol, ...styles.additionStyle },
            { borderBottom: "1px solid black" },
          ]}
        >
          <>{data.prepared_by}</>
        </Text>
        <Text
          style={[
            { ...styles.thirdCol, ...styles.additionStyle },
            { borderBottom: "1px solid black" },
          ]}
        >
          <>{data.verified_by}</>
        </Text>
        <Text
          style={[
            { ...styles.fourthCol, ...styles.additionStyle },
            { borderBottom: "1px solid black" },
          ]}
        >
          <>{data.approved_by}</>
        </Text>
        <Text style={{ padding: 5, lineHeight: 1.1, flex: 1 }}>
          {data.remarks}
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
  firstCol: { flexBasis: "30%", borderRight: "1px solid balck", padding: 7 },
  secondCol: {
    flexBasis: "25%",
    borderRight: "1px solid balck",

    padding: 7,
  },
  thirdCol: { flexBasis: "25%", borderRight: "1px solid balck", padding: 7 },
  fourthCol: { flexBasis: "20%", padding: 7 },
  additionStyleHeading: {
    borderTop: "1px solid black",
    fontWeight: "bold",
  },
  additionStyle: {
    borderTop: "1px solid black",
  },
  additionStyleFirtRow: {
    fontWeight: "bold",
  },
});

export default Summary;
