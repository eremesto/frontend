import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import styles from "./RegistrationStyle";
import { NavigationType } from "../../../Navigation";
import { useAppSelector } from "redux/store";
import RegistrationUser from "./RegistrationUser/RegistrationUser";
import RegistrationAutoService from "./RegistrationAutoService/RegistrationAutoService";

const DEFAULT_AUTO_SERVICE_TITLE = "Регистрация автосервиса";

const Registration = ({ navigation }: NavigationType) => {
  const authType = useAppSelector((state) => state.registrationType.type);
  const [autoServiceTitle, setAutoServiceTitle] = useState(DEFAULT_AUTO_SERVICE_TITLE);
  const registrationTitle =
    authType === "user" ? "Регистрация пользователя" : autoServiceTitle;

  useEffect(() => {
    if (authType !== "service") {
      setAutoServiceTitle(DEFAULT_AUTO_SERVICE_TITLE);
    }
  }, [authType]);

  return (
    <View style={styles.container}>
      {registrationTitle ? (
        <Text style={styles.title}>{registrationTitle}</Text>
      ) : null}
      {authType === "user" ? (
        <RegistrationUser navigation={navigation} />
      ) : (
        <RegistrationAutoService
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default Registration;
