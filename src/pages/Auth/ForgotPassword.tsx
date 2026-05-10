import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from "react-native";
import TextInputComponent from "@components/TextInputComponent";
import ButtonComponent from "@components/ButtonComponent";
import { baseUrl } from "api/baseUrl";
import Toast from "react-native-toast-message";

const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);

  const sendResetCode = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Введите email" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/verification/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset-password" }),
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

  const resetPassword = async () => {
    if (!code || !newPassword || !confirmNewPassword) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Заполните все поля" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароли не совпадают" });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Новый пароль должен содержать минимум 6 символов" });
      return;
    }
    if (/^\d+$/.test(newPassword)) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Пароль не может состоять только из цифр" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/verification/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        Toast.show({ type: "success", text1: "Успех", text2: "Пароль изменён. Войдите с новым паролем." });
        navigation.goBack();
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Проблема соединения" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {step === "email" ? (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Восстановление пароля</Text>
            <TextInputComponent value={email} setValue={setEmail} placeholder="Ваш email" isSearch={false} />
            <View style={styles.spacer} />
            <ButtonComponent onPress={sendResetCode} isLoading={isLoading} title="Отправить код" />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
              <Text style={styles.linkText}>Вспомнил пароль? Войти</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Введите код из письма</Text>
            <TextInputComponent value={code} setValue={setCode} placeholder="Код из письма" isSearch={false} />
            <View style={styles.spacer} />
            <TextInputComponent value={newPassword} setValue={setNewPassword} placeholder="Новый пароль" secureTextEntry isSearch={false} />
            <View style={styles.spacer} />
            <TextInputComponent value={confirmNewPassword} setValue={setConfirmNewPassword} placeholder="Повторите пароль" secureTextEntry isSearch={false} />
            <View style={styles.spacer} />
            <ButtonComponent onPress={resetPassword} isLoading={isLoading} title="Сбросить пароль" />
            <TouchableOpacity onPress={() => setStep("email")} style={styles.link}>
              <Text style={styles.linkText}>Изменить email</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#3B3B3B" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  innerContainer: { width: "100%", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 30, textAlign: "center" },
  spacer: { marginVertical: 12 },
  link: { marginTop: 20 },
  linkText: { color: "#FFC107", fontSize: 14 },
});

export default ForgotPassword;