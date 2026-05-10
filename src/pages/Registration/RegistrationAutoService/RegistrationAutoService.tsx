import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import RegistrationAutoServiceStepOne from "./RegistrationAutoServiceStepOne";
import RegistrationAutoServiceStepThree from "./RegistrationAutoServiceStepThree";
import RegistrationAutoServiceStepTwo from "./RegistrationAutoServiceStepTwo";
import { NavigationType } from "../../../../Navigation";
import { useRegisterServiceMutation } from "api/AutoService/registrationAutoService";
import { styles } from "./AutoServiceStyle";
import Toast from "react-native-toast-message";
import { useAppDispatch } from "redux/store";
import { setServiceData } from "redux/Slices/UserSlice/registrationUserSlice";
import { baseUrl } from "api/baseUrl";
import TextInputComponent from "@components/TextInputComponent";
import ButtonComponent from "@components/ButtonComponent";

type Step = "email" | "code" | "details" | "contacts" | "services";

const RegistrationAutoService = ({ navigation }: NavigationType) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [tempToken, setTempToken] = useState("");

  const [nameService, setNameService] = useState("");
  const [webAddress, setWebAddress] = useState("");
  const [startOfWork, setStartOfWork] = useState("");
  const [endOfWork, setEndOfWork] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [is24Hours, setIs24Hours] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [registerService, { isLoading: isRegisterLoading }] = useRegisterServiceMutation();
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
        Toast.show({ type: "success", text1: "Код отправлен", text2: "Проверьте почту" });
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Не удалось отправить код" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Введите код" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/verification/confirm-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        setTempToken(data.tempToken);
        setStep("details");
        Toast.show({ type: "success", text1: "Код подтверждён", text2: "Заполните информацию о сервисе" });
      } else {
        Toast.show({ type: "error", text1: "Ошибка", text2: data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Проблема соединения" });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === "details") setStep("contacts");
    else if (step === "contacts") setStep("services");
  };

  const prevStep = () => {
    if (step === "services") setStep("contacts");
    else if (step === "contacts") setStep("details");
    else if (step === "details") setStep("email");
  };

  const handleRegister = async () => {
    if (services.length === 0) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Выберите хотя бы одну услугу!" });
      return;
    }
    try {
      const registrationData = {
        tempToken,
        password,
        nameService,
        webAddress,
        startOfWork: is24Hours ? "00:00" : startOfWork,
        endOfWork: is24Hours ? "23:59" : endOfWork,
        telephoneNumber,
        city,
        address,
        services,
      };
      const result = await registerService(registrationData).unwrap();
      dispatch(setServiceData(result.service));
      Toast.show({ type: "success", text1: "Успех", text2: "Регистрация завершена!" });
      navigation.navigate("Main");
    } catch (error) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Регистрация не удалась. Попробуйте снова." });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {step === "email" && (
        <>
          <TextInputComponent value={email} setValue={setEmail} placeholder="Email" isSearch={false} />
          <View style={{ marginVertical: 10 }} />
          <TextInputComponent value={password} setValue={setPassword} placeholder="Пароль" secureTextEntry isSearch={false} />
          <View style={{ marginVertical: 10 }} />
          <TextInputComponent value={confirmPassword} setValue={setConfirmPassword} placeholder="Повторите пароль" secureTextEntry isSearch={false} />
          <View style={{ marginVertical: 15 }} />
          <ButtonComponent onPress={sendCode} isLoading={isLoading} title="Отправить код" />
        </>
      )}
      {step === "code" && (
        <>
          <TextInputComponent value={code} setValue={setCode} placeholder="Код из письма" isSearch={false} />
          <View style={{ marginVertical: 15 }} />
          <ButtonComponent onPress={verifyCode} isLoading={isLoading} title="Подтвердить код" />
          <TouchableOpacity onPress={() => setStep("email")} style={{ marginTop: 20 }}>
            <Text style={{ color: "#FFC107" }}>Изменить email</Text>
          </TouchableOpacity>
        </>
      )}
      {(step === "details" || step === "contacts" || step === "services") && (
        <>
          {step === "details" && (
            <RegistrationAutoServiceStepOne
              nameService={nameService}
              setNameService={setNameService}
            />
          )}
          {step === "contacts" && (
            <RegistrationAutoServiceStepTwo
              phone={telephoneNumber}
              setPhone={setTelephoneNumber}
              webAddress={webAddress}
              setWebAddress={setWebAddress}
              startOfWork={startOfWork}
              setStartOfWork={setStartOfWork}
              endOfWork={endOfWork}
              setEndOfWork={setEndOfWork}
              city={city}
              setCity={setCity}
              address={address}
              setAddress={setAddress}
              is24Hours={is24Hours}
              setIs24Hours={setIs24Hours}
            />
          )}
          {step === "services" && (
            <RegistrationAutoServiceStepThree setServices={setServices} />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={prevStep}>
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
            {step !== "services" ? (
              <TouchableOpacity style={styles.button} onPress={nextStep}>
                <Text style={styles.buttonText}>Продолжить</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isRegisterLoading}>
                <Text style={styles.buttonText}>{isRegisterLoading ? "Регистрация..." : "Регистрация"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default RegistrationAutoService;