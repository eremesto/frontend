import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  //   buttonContainer: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     marginVertical: 10,
  //   },
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
    width: 50, // Задайте ширину изображения
    height: 50, // Задайте высоту изображения
    borderRadius: 5, // Сглаживаем края изображения
    marginRight: 16, // Отступ между изображением и текстом
  },
  serviceInfo: {
    flex: 1, // Позволяет тексту и чекбоксу занимать оставшееся пространство
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
