import React, { useState } from "react";
import { TextInput, View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import type { KeyboardTypeOptions } from "react-native";
import Icon from "./Icon";
import loup from "assets/loup.png";

const { width, height } = Dimensions.get("window");

interface TextInputComponentProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  isSearch: boolean;
  removeWhitespace?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  value,
  setValue,
  placeholder,
  secureTextEntry = false,
  isSearch,
  removeWhitespace = false,
  keyboardType = "default",
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const handleChangeText = (text: string) => {
    setValue(removeWhitespace ? text.replace(/\s+/g, "") : text);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#FFC107"
        secureTextEntry={secureTextEntry ? isHidden : false}
        style={styles.input}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoComplete="off"                    // отключает автозаполнение
        textContentType="none"               // для iOS – убирает подсказки
        importantForAutofill="no"            // для Android – не использовать для автозаполнения
        autoCorrect={false}                  // отключает автокоррекцию
        spellCheck={false}                   // отключает проверку орфографии
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setIsHidden(!isHidden)} style={styles.eyeBtn}>
          <Icon name={isHidden ? "eye-off" : "eye"} size={20} color="#FFC107" />
        </TouchableOpacity>
      )}
      {isSearch && <Image source={loup} style={styles.searchIcon} />}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFC107",
    paddingHorizontal: 8,
    width: width * 0.8,
    height: height * 0.05,
    position: "relative",
  },
  input: {
    color: "#FFC107",
    fontSize: width * 0.04,
    flex: 1,
    height: height * 0.05,
    paddingHorizontal: 8,
  },
  eyeBtn: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});

export default TextInputComponent;
