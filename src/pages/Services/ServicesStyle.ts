import { Dimensions, StyleSheet } from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  searchContainer: {
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 29,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: screenWidth * 0.44,
    height: screenHeight * 0.22,
    backgroundColor: "#f0f0f0", // светлый фон — иконки хорошо видны
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedServiceCard: {
    borderColor: "#FFC107",
  },
  serviceIconWrap: {
    height: screenHeight * 0.15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  serviceImage: {
    width: screenWidth * 0.22,
    height: screenWidth * 0.22,
    opacity: 1,
  },
  serviceTextWrap: {
    width: "100%",
    backgroundColor: "#1d1d1d",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
  serviceText: {
    color: "#ffffff",
    fontSize: screenWidth * 0.036,
    fontWeight: "700",
    textAlign: "center",
  },
  // Оверлей больше не нужен но оставим для совместимости
  serviceOverlay: {},
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#2c2c2c",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "#FFC107",
    width: "80%",
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 20,
    alignSelf: "center",
  },
  findServicesText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B3B3B",
  },
  servicesBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
});
