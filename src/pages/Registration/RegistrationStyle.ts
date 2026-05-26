import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B3B3B",
    padding: 20,
    flex: 1, 
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});

export default styles;
