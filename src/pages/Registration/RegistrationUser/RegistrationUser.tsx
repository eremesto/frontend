import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TextInputComponent from "@components/TextInputComponent";
import styles from "./RegistrationUserStyle";
import { NavigationType } from "../../../../Navigation";
import ButtonComponent from "@components/ButtonComponent";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "redux/store";
import { setUserData } from "redux/Slices/UserSlice/registrationUserSlice";
import { baseUrl } from "api/baseUrl";

const RegistrationUser = ({ navigation }: NavigationType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const isPasswordValid = (pwd: string) => {
    if (pwd.length < 6) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароль должен содержать минимум 6 символов" });
      return false;
    }
    if (pwd === email) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароль не должен совпадать с email" });
      return false;
    }
    if (/^\d+$/.test(pwd)) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароль не может состоять только из цифр" });
      return false;
    }
    return true;
  };

  const sendCode = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Введите email" });
      return;
    }
    if (!password) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Введите пароль" });
      return;
    }
    if (!isPasswordValid(password)) return;
    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароли не совпадают" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/verification/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "registration" }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("code");
        Toast.show({ type: "success", text1: "Код отправлен", text2: "Проверьте вашу почту" });
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Не удалось отправить код" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndRegister = async () => {
    if (!code) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Введите код" });
      return;
    }
    setIsLoading(true);
    try {
      const confirmRes = await fetch(`${baseUrl}/verification/confirm-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        Toast.show({ type: "error", text1: "Ошибка", text2: confirmData.message });
        return;
      }
      const { tempToken } = confirmData;

      const regRes = await fetch(`${baseUrl}/user/registrationUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, password }),
      });
      const regData = await regRes.json();
      if (regRes.ok) {
        dispatch(setUserData(regData.user));
        Toast.show({ type: "success", text1: "Успешно!", text2: "Регистрация завершена." });
        navigation.navigate("Main");
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: regData.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Проблема соединения" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === "email" ? (
        <>
          <TextInputComponent value={email} setValue={setEmail} placeholder="Email" isSearch={false} />
          <View style={{ marginVertical: 10 }} />
          <TextInputComponent value={password} setValue={setPassword} placeholder="Пароль" secureTextEntry isSearch={false} />
          <View style={{ marginVertical: 10 }} />
          <TextInputComponent value={confirmPassword} setValue={setConfirmPassword} placeholder="Повторите пароль" secureTextEntry isSearch={false} />
          <View style={{ marginVertical: 15 }} />
          <ButtonComponent onPress={sendCode} isLoading={isLoading} title="Отправить код" />
        </>
      ) : (
        <>
          <TextInputComponent value={code} setValue={setCode} placeholder="Код из письма" isSearch={false} />
          <View style={{ marginVertical: 15 }} />
          <ButtonComponent onPress={verifyAndRegister} isLoading={isLoading} title="Зарегистрироваться" />
          <TouchableOpacity onPress={() => setStep("email")} style={{ marginTop: 20 }}>
            <Text style={{ color: "#FFC107" }}>Изменить email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default RegistrationUser;