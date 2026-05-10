import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#FFC107",
    width: width * 0.7, // Ширина кнопки 70% от ширины экрана
    paddingVertical: 12, // Внутренние отступы для увеличения высоты кнопки
    borderRadius: 24, // Округленные углы кнопки
    marginBottom: 25, // Отступ между кнопками и другими элементами
    marginTop: height * 0.03, // Отступ сверху для дополнительного пространства
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B3B3B", // Цвет текста кнопки
  },
});

export default styles;
