import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  buttonWrapper: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  separator: {
    fontSize: 30,
    color: "#FFC107",
  },
  timeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "white",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    color: "white",
  },
  fullWidth: {
    width: "100%",
  },
  serviceImage: {
    width: 50, 
    height: 50, 
    borderRadius: 5, 
    marginRight: 16, 
  },
  serviceInfo: {
    flex: 1, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceBlock: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
});
