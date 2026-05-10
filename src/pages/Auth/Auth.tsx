import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import logo from "assets/logo.png";
import { useLoginUserMutation } from "api/Users/loginUser";
import { useLoginAutoServiceMutation } from "api/AutoService/loginAutoService";
import TextInputComponent from "@components/TextInputComponent";
import styles from "./AuthStyle";
import { NavigationType } from "../../../Navigation";
import { useAppDispatch, useAppSelector } from "redux/store";
import { setAuthType } from "redux/authTypeSlice";
import { setUserData, setServiceData } from "redux/Slices/UserSlice/registrationUserSlice";
import ButtonComponent from "@components/ButtonComponent";
import Toast from "react-native-toast-message";

const Auth = ({ navigation }: NavigationType) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading: isUserLoading }] = useLoginUserMutation();
  const [loginAutoService, { isLoading: isServiceLoading }] = useLoginAutoServiceMutation();

  const dispatch = useAppDispatch();
  const authType = useAppSelector((state) => state.registrationType.type);

  const handleLogin = async () => {
    try {
      if (authType === "user") {
        const result = await loginUser({ login, password }).unwrap();
        dispatch(setUserData(result.user));
        Toast.show({ type: "success", text1: "Успешный вход!", text2: "Добро пожаловать, пользователь.", visibilityTime: 2000 });
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      } else if (authType === "service") {
        const result = await loginAutoService({ login, password }).unwrap();
        dispatch(setServiceData(result.service));
        Toast.show({ type: "success", text1: "Успешный вход!", text2: "Добро пожаловать в профиль сервиса.", visibilityTime: 2000 });
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: "Выберите пользователя для входа.", visibilityTime: 2000 });
      }
    } catch (error) {
      const typedError = error as { data?: { message?: string } };
      Toast.show({ type: "error", text1: "Ошибка входа", text2: typedError.data?.message || "Ошибка входа.", visibilityTime: 3000 });
    }
  };

  const handleRegistration = () => {
    navigation.navigate("Registration");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const selectService = () => dispatch(setAuthType("service"));
  const selectUser = () => dispatch(setAuthType("user"));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#3B3B3B' }} behavior={Platform.OS === "android" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#3B3B3B' }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>STO HELPER</Text>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.serviceButton, authType === "service" ? styles.activeButton : styles.inactiveButton]}
              onPress={selectService}
            >
              <Text style={styles.buttonText}>Сервис</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> / </Text>
            <TouchableOpacity
              style={[styles.userButton, authType === "user" ? styles.activeButton : styles.inactiveButton]}
              onPress={selectUser}
            >
              <Text style={styles.buttonText}>Пользователь</Text>
            </TouchableOpacity>
          </View>

          <TextInputComponent value={login} setValue={setLogin} placeholder="Логин (email)" isSearch={false} />
          <View style={{ marginBottom: 15 }} />
          <TextInputComponent value={password} setValue={setPassword} placeholder="Пароль" secureTextEntry isSearch={false} />
          <View style={{ marginBottom: 15 }} />
          <ButtonComponent onPress={handleLogin} isLoading={isUserLoading || isServiceLoading} title="Вход" />

          <TouchableOpacity onPress={handleRegistration}>
            <Text style={styles.registerText}>Регистрация</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 10 }}>
            <Text style={{ color: "#FFC107", fontSize: 14 }}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Auth;