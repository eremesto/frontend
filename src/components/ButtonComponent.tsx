// CustomButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface CustomButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  title: string;
}

const ButtonComponent: React.FC<CustomButtonProps> = ({
  onPress,
  isLoading,
  title,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{isLoading ? "Загрузка..." : title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default ButtonComponent;
