import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TextInputComponent from "@components/TextInputComponent";
import PhoneInputComponent from "@components/PhoneInputComponent";

const { width } = Dimensions.get("window");

interface StepTwoProps {
  phone: string;
  setPhone: (value: string) => void;
  webAddress: string;
  setWebAddress: (value: string) => void;
  startOfWork: string;
  setStartOfWork: (value: string) => void;
  endOfWork: string;
  setEndOfWork: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  is24Hours: boolean;
  setIs24Hours: (value: boolean) => void;
}

const RegistrationAutoServiceStepTwo: React.FC<StepTwoProps> = ({
  phone,
  setPhone,
  webAddress,
  setWebAddress,
  startOfWork,
  setStartOfWork,
  endOfWork,
  setEndOfWork,
  city,
  setCity,
  address,
  setAddress,
  is24Hours,
  setIs24Hours,
}) => {
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);

  const handleStartConfirm = (date: Date) => {
    hideStartPicker();
    const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);
    setStartOfWork(formattedTime);
  };

  const handleEndConfirm = (date: Date) => {
    hideEndPicker();
    const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);
    setEndOfWork(formattedTime);
  };

  const handle24HoursToggle = (value: boolean) => {
    setIs24Hours(value);
    if (value) {
      setStartOfWork("00:00");
      setEndOfWork("23:59");
    } else {
      setStartOfWork("");
      setEndOfWork("");
    }
  };

  return (
    <>
      <PhoneInputComponent value={phone} setValue={setPhone} />
      <View style={{ marginVertical: 10 }} />

      <TextInputComponent
        value={webAddress}
        setValue={setWebAddress}
        placeholder="Адрес сайта"
        isSearch={false}
      />
      <View style={{ marginVertical: 10 }} />

      <TextInputComponent
        value={city}
        setValue={setCity}
        placeholder="Город"
        isSearch={false}
      />
      <View style={{ marginVertical: 10 }} />

      <TextInputComponent
        value={address}
        setValue={setAddress}
        placeholder="Адрес"
        isSearch={false}
      />
      <View style={{ marginVertical: 10 }} />

      {/* Круглосуточный режим */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Круглосуточно</Text>
        <Switch
          value={is24Hours}
          onValueChange={handle24HoursToggle}
          trackColor={{ false: "#444", true: "#FFC107" }}
          thumbColor={is24Hours ? "#fff" : "#aaa"}
        />
      </View>

      {!is24Hours && (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={showStartPicker}>
              <Text style={styles.buttonText}>Выбрать время начала</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>/</Text>
            <TouchableOpacity style={styles.buttonWrapper} onPress={showEndPicker}>
              <Text style={styles.buttonText}>Выбрать время конца</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              Начало работы: {startOfWork || "Не выбрано"}
            </Text>
            <Text style={styles.timeText}>
              Конец работы: {endOfWork || "Не выбрано"}
            </Text>
          </View>
        </>
      )}

      {is24Hours && (
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Круглосуточно 🕒</Text>
        </View>
      )}

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="time"
        display="spinner"
        onConfirm={handleStartConfirm}
        onCancel={hideStartPicker}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="time"
        display="spinner"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.8,
    marginVertical: 15,
  },
  switchLabel: {
    color: "#FFC107",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.8,
    marginVertical: 10,
  },
  buttonWrapper: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#3B3B3B",
    fontWeight: "bold",
  },
  separator: {
    fontSize: 30,
    color: "#FFC107",
  },
  timeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  timeText: {
    fontSize: 16,
    color: "white",
  },
});

export default RegistrationAutoServiceStepTwo;