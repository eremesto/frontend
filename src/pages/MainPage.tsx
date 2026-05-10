import React from "react";
import Auth from "./Auth/Auth";
import { View, StyleSheet } from "react-native";

export const MainPage = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

// Стили для компонента MainPage
const styles = StyleSheet.create({
  container: {
    flex: 1, // Позволяет контейнеру занимать весь экран
    backgroundColor: "#3B3B3B", // Устанавливаем цвет фона, если необходимо
  },
});

export default MainPage;
