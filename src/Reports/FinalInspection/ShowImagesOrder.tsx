import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";

function ShowImagesOrder({
  smallImages,
  largeImages,
  mediumImages,
}: {
  smallImages: any[];
  largeImages: any[];
  mediumImages: any[];
}) {
  return (
    <>
      <View style={styles.main} wrap>
        {smallImages.length > 0 &&
          smallImages.map((image: any, index: number) => (
            <View>
              <Image
                key={index}
                style={{
                  width: 260,
                  height: 230,
                  padding: 15,
                  border: "1px solid black",
                }}
                src={image.url}
              />
              <Text style={{ fontSize: 12, padding: 3 }}>{image.remarks}</Text>
            </View>
          ))}
      </View>

      <View style={styles.medium}>
        {mediumImages.length > 0 &&
          mediumImages.map((image: any, index: number) => (
            <View>
              <Image
                key={index}
                style={{
                  width: "100%",
                  height: 380,
                  padding: 10,
                  border: "1px solid black",
                }}
                src={image.url}
              />
              <Text style={{ fontSize: 12, padding: 3 }}>{image.remarks}</Text>
            </View>
          ))}
      </View>

      <View style={styles.large}>
        {largeImages.length > 0 &&
          largeImages.map((image: any, index: number) => (
            <View break>
              <Image
                key={index}
                style={{
                  width: "100%",
                  height: 750,
                  padding: 10,
                  border: "1px solid black",
                }}
                src={image.url}
              />
              <Text style={{ fontSize: 12, padding: 3 }}>{image.remarks}</Text>
            </View>
          ))}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    display: "flex",

    justifyContent: "space-between",
    flexWrap: "wrap",
    flexDirection: "row",
  },

  medium: {
    display: "flex",
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  large: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
});

export default ShowImagesOrder;
