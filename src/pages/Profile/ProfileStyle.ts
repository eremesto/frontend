import { Dimensions, StyleSheet } from "react-native";

// Получаем размеры экрана
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3B3B3B",
    padding: 20,
    flex: 1, // Чтобы контейнер занимал весь экран
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  serviceButton: {
    backgroundColor: "#FFC107", // Основной желтый цвет
    flex: 1,
    padding: 10,
    marginRight: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  userButton: {
    backgroundColor: "#FFC107", // Основной желтый цвет
    flex: 1,
    padding: 10,
    marginLeft: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#FFC107", // Яркий желтый цвет для активной кнопки
  },
  inactiveButton: {
    backgroundColor: "#D3B89A", // Затемненный цвет для неактивной кнопки (можно использовать любой другой цвет)
  },
  input: {
    borderColor: "#FFC107",
    borderWidth: 1,
    color: "#FFC107",
    width: "80%",
    height: 40,
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#FFC107",
    width: width * 0.7,
    paddingVertical: 10,
    borderRadius: 24,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B3B3B",
  },
  registerText: {
    color: "#FFC107",
    fontSize: 16,
  },
  separator: {
    marginHorizontal: 6, // Отступы по горизонтали
    fontSize: 30, // Размер шрифта для разделителя
    color: "#FFC107", // Цвет разделителя
  },
});

export default styles;
