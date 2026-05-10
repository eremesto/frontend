import React, { useState } from "react";
import { TextInput, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface PhoneInputProps {
  value: string;
  setValue: (value: string) => void;
}

const formatPhoneNumber = (text: string): string => {
  // Удаляем все нецифровые символы
  const cleaned = text.replace(/\D/g, "");
  
  // Ограничиваем до 11 цифр (7 + 10 цифр номера)
  const limited = cleaned.slice(0, 11);
  
  if (limited.length === 0) return "+7";
  if (limited === "7") return "+7";
  
  // Форматируем по маске +7 (XXX) XXX-XX-XX
  let result = "+7";
  
  if (limited.length > 1) {
    const areaCode = limited.slice(1, 4);
    result += ` (${areaCode}`;
    if (limited.length >= 4) result += ")";
  }
  
  if (limited.length >= 4) {
    const firstPart = limited.slice(4, 7);
    if (firstPart) result += ` ${firstPart}`;
  }
  
  if (limited.length >= 7) {
    const secondPart = limited.slice(7, 9);
    if (secondPart) result += `-${secondPart}`;
  }
  
  if (limited.length >= 9) {
    const thirdPart = limited.slice(9, 11);
    if (thirdPart) result += `-${thirdPart}`;
  }
  
  return result.trim();
};

const PhoneInputComponent: React.FC<PhoneInputProps> = ({ value, setValue }) => {
  const handleChangeText = (text: string) => {
    // Если пользователь стирает всё, оставляем пустым
    if (text === "" || text === "+7") {
      setValue("");
      return;
    }
    const formatted = formatPhoneNumber(text);
    setValue(formatted);
  };
  
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder="+7 (XXX) XXX-XX-XX"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: "#FFC107",
    paddingHorizontal: 8,
    width: width * 0.8,
    height: height * 0.05,
    justifyContent: "center",
  },
  input: {
    color: "#FFC107",
    fontSize: width * 0.04,
    padding: 0,
  },
});

export default PhoneInputComponent;