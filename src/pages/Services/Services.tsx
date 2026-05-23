import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, TouchableOpacity, ActivityIndicator, Image, Pressable, ScrollView,
} from "react-native";
import styles from "./ServicesStyle";
import TextInputComponent from "@components/TextInputComponent";
import { useGetServicesQuery } from "api/Users/getServices";
import Toast from "react-native-toast-message";

type ServiceFilterKey =
  | "all"
  | "maintenance"
  | "diagnostics"
  | "wheels"
  | "body"
  | "engine"
  | "electric"
  | "other";

type ServiceFilterOption = {
  key: ServiceFilterKey;
  label: string;
};

type ServiceItem = {
  _id: string;
  name: string;
  urlServices: string;
};

type CategorizedFilterKey = Exclude<ServiceFilterKey, "all" | "other">;

const SERVICE_FILTERS: ServiceFilterOption[] = [
  { key: "all", label: "Все" },
  { key: "maintenance", label: "ТО" },
  { key: "diagnostics", label: "Диагностика" },
  { key: "wheels", label: "Колёса" },
  { key: "body", label: "Кузов" },
  { key: "engine", label: "Двигатель" },
  { key: "electric", label: "Электрика" },
  { key: "other", label: "Прочее" },
];

const SERVICE_FILTER_KEYWORDS: Record<CategorizedFilterKey, string[]> = {
  maintenance: ["масл", "обслуж", "тех"],
  diagnostics: ["диагност"],
  wheels: ["шин", "колес", "колёс", "диск"],
  body: ["кузов", "стекл"],
  engine: ["двигател", "топлив", "охлажд", "короб", "передач", "подвес", "тормоз"],
  electric: ["электр", "фар", "оптик"],
};

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

const getServiceFilterKey = (serviceName: string): ServiceFilterKey => {
  const normalizedName = serviceName.toLowerCase();
  const matchedFilter = Object.entries(SERVICE_FILTER_KEYWORDS).find(([, keywords]) =>
    keywords.some((keyword) => normalizedName.includes(keyword))
  );

  return matchedFilter ? (matchedFilter[0] as CategorizedFilterKey) : "other";
};

const Services = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ServiceFilterKey>("all");
  const { data: services, error, isLoading } = useGetServicesQuery();
  const [selectedServices, setSelectedServices] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: "Ошибка", text2: "Не удалось загрузить услуги.", visibilityTime: 3000 });
    }
  }, [error]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return ((services as ServiceItem[] | undefined) || [])
      .filter((service) => {
        if (selectedFilter === "all") return true;
        return getServiceFilterKey(service.name) === selectedFilter;
      })
      .filter((service) => service.name.toLowerCase().includes(normalizedSearch));
  }, [searchText, selectedFilter, services]);

  const handleServicePress = (service: ServiceItem) => {
    const isSelected = selectedServices.some((s) => s.id === service._id);
    if (isSelected) setSelectedServices(selectedServices.filter((s) => s.id !== service._id));
    else setSelectedServices([...selectedServices, { id: service._id, name: service.name }]);
  };

  const handleFindServices = () => {
    if (selectedServices.length === 0) return;
    navigation.navigate("SearchResults", { selectedServices });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInputComponent value={searchText} setValue={setSearchText} placeholder="Поиск" isSearch={true} />
      </View>
      <Text style={styles.header}>Выберите вид услуг</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContainer}
      >
        {SERVICE_FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.key;

          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFC107" />
      ) : error ? null : filteredServices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Ничего не найдено</Text>
          <Text style={styles.emptyText}>Попробуйте изменить фильтр или поисковый запрос</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.servicesGrid}>
            {filteredServices.map((item) => {
              const isSelected = selectedServices.some((s) => s.id === item._id);
              const imageSource = getImageSource(item.urlServices);

              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => handleServicePress(item)}
                  style={[styles.serviceCard, isSelected && styles.selectedServiceCard]}
                  activeOpacity={0.85}
                >
                  {/* Иконка по центру карточки */}
                  <View style={styles.serviceIconWrap}>
                    <Image
                      source={imageSource}
                      style={styles.serviceImage}
                      resizeMode="contain"
                    />
                  </View>
                  {/* Название снизу */}
                  <View style={styles.serviceTextWrap}>
                    <Text style={styles.serviceText} numberOfLines={2}>{item.name}</Text>
                  </View>
                  {/* Галочка если выбрано */}
                  {isSelected && (
                    <View style={{
                      position: "absolute", top: 8, right: 8,
                      backgroundColor: "#FFC107", borderRadius: 12,
                      width: 24, height: 24, justifyContent: "center", alignItems: "center"
                    }}>
                      <Text style={{ color: "#1d1d1d", fontSize: 14, fontWeight: "bold" }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
      {selectedServices.length > 0 && (
        <View style={styles.buttonContainer}>
          <Pressable onPress={handleFindServices}>
            <Text style={styles.findServicesText}>Найти автосервисы</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Services;
