import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetServicesQuery } from "api/Users/getServices";
import Icon from "components/Icon";

interface StepThreeProps {
  setServices: (value: string[]) => void;
}

interface Service {
  _id: string;
  name: string;
  urlServices: string;
}

const serviceImages: Record<string, any> = {
  "oil-change.png": require("assets/services/oil-change.png"),
  "computer_diagnostics.png": require("assets/services/computer_diagnostics.png"),
  "tire-system.png": require("assets/services/tire-system.png"),
  "car-body-repair.png": require("assets/services/car-body-repair.png"),
  "brake-system.png": require("assets/services/brake-system.png"),
  "electrical-equipment-repair.png": require("assets/services/electrical-equipment-repair.png"),
  "engine-repair.png": require("assets/services/engine-repair.png"),
  "fuel-system.png": require("assets/services/fuel-system.png"),
  "headlights.png": require("assets/services/headlights.png"),
  "suspension.png": require("assets/services/suspension.png"),
  "car-window-glass.png": require("assets/services/car-window-glass.png"),
  "transmission-repair.png": require("assets/services/transmission-repair.png"),
  "cooling-system.png": require("assets/services/cooling-system.png"),
};

const getImageSource = (urlServices: string) => {
  if (serviceImages[urlServices]) return serviceImages[urlServices];
  return { uri: urlServices };
};

const RegistrationAutoServiceStepThree: React.FC<StepThreeProps> = ({
  setServices,
}) => {
  const { data: services, error, isLoading } = useGetServicesQuery();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (serviceName: string) => {
    setSelectedServices((prevServices) => {
      const isSelected = prevServices.includes(serviceName);
      const newServices = isSelected
        ? prevServices.filter((service) => service !== serviceName)
        : [...prevServices, serviceName];
      setServices(newServices);
      return newServices;
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text style={styles.stateText}>Загрузка услуг...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="warning" size={32} color="#ff6b6b" />
        <Text style={styles.errorText}>Ошибка при загрузке услуг</Text>
      </View>
    );
  }

  if (!services || services.length === 0) {
    return (
      <View style={styles.centered}>
        <Icon name="empty" size={48} color="#888" />
        <Text style={styles.stateText}>Нет доступных услуг</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerBlock}>
        <Text style={styles.header}>Отметьте все подходящие услуги</Text>
        <Text style={styles.selectedCount}>Выбрано: {selectedServices.length}</Text>
      </View>

      <View style={styles.servicesGrid}>
        {services.map((service: Service) => {
          const isSelected = selectedServices.includes(service.name);
          const imageSource = getImageSource(service.urlServices);

          return (
            <TouchableOpacity
              key={service._id}
              style={[styles.serviceCard, isSelected && styles.selectedServiceCard]}
              onPress={() => toggleService(service.name)}
              activeOpacity={0.85}
            >
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Icon name="check" size={14} color="#1d1d1d" />
                </View>
              )}

              <View style={styles.serviceImageWrap}>
                {imageSource ? (
                  <Image
                    source={imageSource}
                    style={styles.serviceImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon name="wrench" size={32} color="#888" />
                )}
              </View>

              <Text
                style={[styles.serviceName, isSelected && styles.selectedServiceName]}
                numberOfLines={2}
              >
                {service.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  stateText: {
    color: "white",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 15,
    textAlign: "center",
  },
  headerBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  selectedCount: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  serviceCard: {
    position: "relative",
    width: "48%",
    minHeight: 154,
    backgroundColor: "#2f2f2f",
    borderWidth: 1,
    borderColor: "#4a4a4a",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedServiceCard: {
    backgroundColor: "#3a3320",
    borderColor: "#FFC107",
    borderWidth: 2,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  serviceImageWrap: {
    width: 82,
    height: 82,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    padding: 10,
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  serviceName: {
    minHeight: 40,
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    lineHeight: 19,
  },
  selectedServiceName: {
    color: "#FFE7A3",
  },
});

export default RegistrationAutoServiceStepThree;