import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Modal, Alert, Dimensions,
} from "react-native";
import { baseUrl } from "api/baseUrl";
import { useAppSelector, useAppDispatch } from "redux/store";
import { setUserData } from "redux/Slices/UserSlice/registrationUserSlice";
import Icon from "components/Icon";

const { height } = Dimensions.get("window");

type ServicePrices = Record<string, string>;

const formatServicePrice = (price?: string) => {
  const trimmedPrice = price?.trim();
  if (!trimmedPrice) return "";
  if (/[₽]|руб/i.test(trimmedPrice)) return trimmedPrice;
  if (/\d/.test(trimmedPrice)) return `${trimmedPrice} ₽`;
  return trimmedPrice;
};

const getServicePriceLabel = (service: any, serviceName: string) =>
  formatServicePrice((service?.servicePrices as ServicePrices | undefined)?.[serviceName]);

const MONTH_NAMES = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const DAY_NAMES = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

const CalendarPicker = ({ value, onChange }: any) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  let selDay = 0, selMonth = -1, selYear = 0;
  if (value && value.length === 10) {
    const parts = value.split(".");
    selDay = parseInt(parts[0]); selMonth = parseInt(parts[1]) - 1; selYear = parseInt(parts[2]);
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDow === 0 ? 6 : firstDow - 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d: number) => d === selDay && viewMonth === selMonth && viewYear === selYear;
  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isPast = (d: number) => new Date(viewYear, viewMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const select = (d: number) => {
    if (isPast(d)) return;
    const dd = String(d).padStart(2,"0");
    const mm = String(viewMonth + 1).padStart(2,"0");
    onChange(`${dd}.${mm}.${viewYear}`);
  };

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <View style={cal.container}>
      <View style={cal.nav}>
        <TouchableOpacity onPress={prevMonth} style={cal.navBtn}>
          <Icon name="back" size={18} color="#FFC107" />
        </TouchableOpacity>
        <Text style={cal.navTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={cal.navBtn}>
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <Icon name="back" size={18} color="#FFC107" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={cal.weekRow}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={[cal.weekDay, (d === "Сб" || d === "Вс") && cal.weekEnd]}>{d}</Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={cal.weekRow}>
          {row.map((d, ci) => {
            if (!d) return <View key={ci} style={cal.cell}/>;
            const selected = isSelected(d);
            const tod = isToday(d);
            const past = isPast(d);
            const isWeekend = (ci === 5 || ci === 6);
            return (
              <TouchableOpacity key={ci} style={[cal.cell, selected && cal.cellSelected, tod && !selected && cal.cellToday]} onPress={() => select(d)} disabled={past}>
                <Text style={[cal.dayText, past && cal.dayPast, isWeekend && !past && !selected && cal.dayWeekend, selected && cal.daySelectedText, tod && !selected && cal.dayTodayText]}>{d}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {value
        ? <View style={cal.preview}><Icon name="calendar" size={14} color="#FFC107" /><Text style={cal.previewText}> {value}</Text></View>
        : <View style={cal.preview}><Text style={[cal.previewText, {color:"#555"}]}>Выберите дату</Text></View>
      }
    </View>
  );
};

const cal = StyleSheet.create({
  container: { backgroundColor:"#1d1d1d", borderRadius:14, padding:12, marginTop:6, borderWidth:1, borderColor:"#333" },
  nav: { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:10 },
  navBtn: { width:36, height:36, borderRadius:18, backgroundColor:"#2a2a2a", justifyContent:"center", alignItems:"center" },
  navTitle: { color:"#fff", fontSize:16, fontWeight:"bold" },
  weekRow: { flexDirection:"row" },
  weekDay: { flex:1, textAlign:"center", color:"#888", fontSize:12, fontWeight:"600", paddingVertical:6 },
  weekEnd: { color:"#e05" },
  cell: { flex:1, aspectRatio:1, justifyContent:"center", alignItems:"center", margin:1, borderRadius:8 },
  cellSelected: { backgroundColor:"#FFC107" },
  cellToday: { backgroundColor:"#2a2a2a", borderWidth:1, borderColor:"#FFC107" },
  dayText: { color:"#fff", fontSize:14, fontWeight:"500" },
  dayPast: { color:"#444" },
  dayWeekend: { color:"#e05" },
  daySelectedText: { color:"#1d1d1d", fontWeight:"bold" },
  dayTodayText: { color:"#FFC107" },
  preview: { flexDirection:"row", marginTop:10, backgroundColor:"#242424", borderRadius:10, padding:10, alignItems:"center", justifyContent:"center", gap:6 },
  previewText: { color:"#FFC107", fontSize:14, fontWeight:"bold" },
});

const SmartTimePicker = ({ value, onChange, serviceId, date }: any) => {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];
  const [selHour, setSelHour] = useState(value ? value.split(":")[0] : "09");
  const [selMin, setSelMin] = useState(value ? value.split(":")[1] : "00");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [workingHours, setWorkingHours] = useState<{ start: string; end: string; is24Hours: boolean }>({
    start: "00:00", end: "23:59", is24Hours: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWorking, setIsLoadingWorking] = useState(true);

  useEffect(() => {
    if (!serviceId) { setIsLoadingWorking(false); return; }
    setIsLoadingWorking(true);
    fetch(`${baseUrl}/service/getServiceById`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: serviceId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.service) {
          const start = data.service.startOfWork || "00:00";
          const end = data.service.endOfWork || "23:59";
          const is24 = start === "00:00" && end === "23:59";
          setWorkingHours({ start, end, is24Hours: is24 });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingWorking(false));
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !date) { setBookedSlots([]); return; }
    setIsLoading(true);
    fetch(`${baseUrl}/service/getBookedSlots`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, date }),
    })
      .then(r => r.json())
      .then(data => setBookedSlots(data.bookedTimes || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setIsLoading(false));
  }, [serviceId, date]);

  const now = new Date();
  const isToday = () => {
    if (!date || date.length !== 10) return false;
    const parts = date.split(".");
    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    return d.toDateString() === now.toDateString();
  };
  const timeToMinutes = (time: string): number => { const [h,m] = time.split(":").map(Number); return h*60+m; };
  const isSlotBlocked = (h: string, m: string) => {
    const slotMinutes = parseInt(h)*60 + parseInt(m);
    if (!workingHours.is24Hours) {
      const startMinutes = timeToMinutes(workingHours.start);
      const endMinutes = timeToMinutes(workingHours.end);
      if (slotMinutes < startMinutes || slotMinutes > endMinutes) return true;
    }
    if (isToday()) {
      const nowMinutes = now.getHours()*60 + now.getMinutes();
      if (slotMinutes <= nowMinutes) return true;
    }
    return bookedSlots.includes(`${h}:${m}`);
  };
  const isHourDisabled = (h: string) => minutes.every(m => isSlotBlocked(h, m));
  const selectHour = (h: string) => {
    if (isHourDisabled(h)) return;
    setSelHour(h);
    if (isSlotBlocked(h, selMin)) {
      const firstFree = minutes.find(m => !isSlotBlocked(h, m));
      if (firstFree) { setSelMin(firstFree); onChange(`${h}:${firstFree}`); }
      else onChange(`${h}:${selMin}`);
    } else onChange(`${h}:${selMin}`);
  };
  const selectMin = (m: string) => {
    if (isSlotBlocked(selHour, m)) return;
    setSelMin(m);
    onChange(`${selHour}:${m}`);
  };
  const isSelectedBlocked = isSlotBlocked(selHour, selMin);

  if (isLoadingWorking) return (
    <View style={{ marginTop:6, alignItems:"center", padding:20 }}>
      <ActivityIndicator color="#FFC107" />
      <Text style={{ color:"#888", marginTop:8 }}>Загружаем часы работы...</Text>
    </View>
  );
  return (
    <View style={{ marginTop: 6 }}>
      {!workingHours.is24Hours && (
        <View style={{ backgroundColor:"#2a2a2a", borderRadius:10, padding:10, marginBottom:12, alignItems:"center", flexDirection:"row", justifyContent:"center", gap:6 }}>
          <Icon name="calendar" size={14} color="#FFC107" />
          <Text style={{ color:"#FFC107", fontSize:13, fontWeight:"bold" }}>Режим работы: {workingHours.start} — {workingHours.end}</Text>
        </View>
      )}
      {isLoading && <View style={{ flexDirection:"row", alignItems:"center", marginBottom:8, gap:6 }}><ActivityIndicator size="small" color="#FFC107" /><Text style={{ color:"#888", fontSize:12 }}>Загружаем доступное время...</Text></View>}
      {!date && <Text style={{ color:"#555", fontSize:13, marginBottom:8 }}>Сначала выберите дату</Text>}
      <Text style={dp.label}>Часы</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {hours.map((h) => {
          let isOutsideWorking = false;
          if (!workingHours.is24Hours) {
            const hourNum = parseInt(h);
            const startHour = parseInt(workingHours.start.split(":")[0]);
            const endHour = parseInt(workingHours.end.split(":")[0]);
            isOutsideWorking = hourNum < startHour || hourNum > endHour;
          }
          const disabled = isHourDisabled(h) || isOutsideWorking;
          const selected = selHour === h && !disabled;
          return (
            <TouchableOpacity key={h} onPress={() => selectHour(h)} disabled={disabled}
              style={[dp.chip, selected && dp.chipActive, disabled && dp.chipDisabled]}>
              <Text style={[dp.chipText, selected && dp.chipTextActive, disabled && dp.chipTextDisabled]}>{h}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={dp.label}>Минуты</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {minutes.map((m) => {
          const blocked = isSlotBlocked(selHour, m);
          const selected = selMin === m && !blocked;
          return (
            <TouchableOpacity key={m} onPress={() => selectMin(m)} disabled={blocked}
              style={[dp.chip, selected && dp.chipActive, blocked && dp.chipDisabled, { flex: 1 }]}>
              <Text style={[dp.chipText, selected && dp.chipTextActive, blocked && dp.chipTextDisabled]}>
                {blocked ? <Icon name="close" size={12} color="#333" /> : m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[dp.preview, isSelectedBlocked && { borderWidth:1, borderColor:"#ff4444" }]}>
        {isSelectedBlocked ? (
          <View style={{ flexDirection:"row", alignItems:"center", gap:6 }}>
            <Icon name="warning" size={16} color="#ff4444" />
            <Text style={[dp.previewText, { color:"#ff4444", fontSize:14 }]}>Это время недоступно</Text>
          </View>
        ) : (
          <Text style={dp.previewText}>Выбрано: {selHour}:{selMin}</Text>
        )}
      </View>
      <View style={{ flexDirection:"row", gap:16, marginTop:8 }}>
        <View style={{ flexDirection:"row", alignItems:"center", gap:4 }}><View style={{ width:12, height:12, borderRadius:3, backgroundColor:"#FFC107" }}/><Text style={{ color:"#888", fontSize:11 }}>Выбрано</Text></View>
        <View style={{ flexDirection:"row", alignItems:"center", gap:4 }}><View style={{ width:12, height:12, borderRadius:3, backgroundColor:"#1a1a1a", borderWidth:1, borderColor:"#2a2a2a" }}/><Text style={{ color:"#888", fontSize:11 }}>Недоступно</Text></View>
      </View>
    </View>
  );
};

const dp = StyleSheet.create({
  label: { fontSize:11, color:"#888", marginBottom:4, textTransform:"uppercase" },
  chip: { backgroundColor:"#2a2a2a", borderRadius:10, paddingHorizontal:12, paddingVertical:8, marginRight:6, borderWidth:1, borderColor:"#444", alignItems:"center" },
  chipActive: { backgroundColor:"#FFC107", borderColor:"#FFC107" },
  chipDisabled: { backgroundColor:"#1a1a1a", borderColor:"#222" },
  chipText: { color:"#888", fontSize:14, fontWeight:"600" },
  chipTextActive: { color:"#1d1d1d" },
  chipTextDisabled: { color:"#333" },
  preview: { backgroundColor:"#1d1d1d", borderRadius:10, padding:10, marginTop:10, alignItems:"center" },
  previewText: { color:"#FFC107", fontSize:16, fontWeight:"bold" },
});

const SearchResults = ({ route, navigation }: any) => {
  const { selectedServices } = route.params;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.registrationUser.user);
  const serviceNames = selectedServices.map((s: any) => s.name);

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<string[]>(user?.favorites || []);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [appDate, setAppDate] = useState("");
  const [appTime, setAppTime] = useState("09:00");
  const [isSending, setIsSending] = useState(false);
  const carInfo = {
  phone: user?.phone || "",
  carBrand: user?.carBrand || "",
  carModel: user?.carModel || "",
  carYear: user?.carYear || "",
  carNumber: user?.carNumber || "",
  vinNumber: user?.vinNumber || "",
  displayName: user?.displayName || user?.login,
  bio: user?.bio || "",
  city: user?.city || "",
  birthDate: user?.birthDate || "",
};

  useEffect(() => {
    fetch(`${baseUrl}/service/shippingAssistance`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assistanceServices: serviceNames }),
    })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setResults(data); else setError(data.message || "Ошибка"); })
      .catch(() => setError("Не удалось подключиться к серверу"))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFavorite = async (serviceId: string) => {
    if (!user) { Alert.alert("Войдите в аккаунт", "Войдите как пользователь"); return; }
    const isFav = favorites.includes(serviceId);
    const url = isFav ? `${baseUrl}/user/removeFavorite` : `${baseUrl}/user/addFavorite`;
    try {
      const res = await fetch(url, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login, serviceId }),
      });
      const data = await res.json();
      if (res.ok) { setFavorites(data.favorites); dispatch(setUserData({ ...user, favorites: data.favorites })); }
    } catch (e) {}
  };

  const handleSendApplication = async () => {
    if (!user) { Alert.alert("Войдите в аккаунт", "Войдите как пользователь"); return; }
    if (!appDate) { Alert.alert("Выберите дату", "Выберите дату в календаре"); return; }
    setIsSending(true);
    try {
      const res1 = await fetch(`${baseUrl}/service/sendApplication`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedService._id, login: user.login, listAssistances: serviceNames, date: appDate, time: appTime, carInfo }),
      });
      const data1 = await res1.json();
      if (!res1.ok) { Alert.alert("Ошибка", data1.message); setIsSending(false); return; }
      const res2 = await fetch(`${baseUrl}/user/addMyApplication`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login, serviceId: selectedService._id, serviceName: selectedService.nameService, listAssistances: serviceNames, date: appDate, time: appTime, declarationId: data1.declarationId, carInfo }),
      });
      const data2 = await res2.json();
      if (res2.ok) dispatch(setUserData({ ...user, myApplications: data2.myApplications }));
      Alert.alert("Готово!", `Заявка в ${selectedService.nameService} на ${appDate} в ${appTime} отправлена!`);
      setShowApplication(false); setAppDate("");
    } catch { Alert.alert("Ошибка", "Проблема с подключением"); }
    finally { setIsSending(false); }
  };

  const ServiceCard = ({ service }: any) => {
    const isFav = favorites.includes(service._id);
    return (
      <TouchableOpacity style={s.card} onPress={() => { setSelectedService(service); setShowDetail(true); }} activeOpacity={0.8}>
        <View style={s.cardHeader}>
          <View style={s.avatar}><Text style={s.avatarText}>{service.nameService?.charAt(0).toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.serviceName}>{service.nameService}</Text>
            {service.city ? <View style={{ flexDirection:"row", alignItems:"center", gap:4, marginTop:2 }}><Icon name="pin" size={12} color="#888" /><Text style={s.serviceCity}>{service.city}</Text></View> : null}
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(service._id)} style={{ padding: 8 }}>
            <Icon name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#ff4444" : "#888"} />
          </TouchableOpacity>
        </View>
        <View style={s.divider} />
        {service.address ? <View style={s.infoRow}><Icon name="pin" size={14} color="#888" /><Text style={s.infoText}>{service.address}</Text></View> : null}
        {service.telephoneNumber ? <View style={s.infoRow}><Icon name="phone" size={14} color="#888" /><Text style={s.infoText}>{service.telephoneNumber}</Text></View> : null}
        {service.startOfWork && service.endOfWork ? <View style={s.infoRow}><Icon name="calendar" size={14} color="#888" /><Text style={s.infoText}>{service.startOfWork} — {service.endOfWork}</Text></View> : null}
        {service.services?.length > 0 && (
          <View style={s.tagsContainer}>
            {service.services.map((sv: string, i: number) => {
              const price = getServicePriceLabel(service, sv);
              return (
                <View key={i} style={[s.tag, serviceNames.includes(sv) && s.tagHL]}>
                  <Text style={[s.tagText, serviceNames.includes(sv) && s.tagTextHL]}>
                    {sv}{price ? ` · ${price}` : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        <TouchableOpacity style={s.applyBtn} onPress={() => { setSelectedService(service); setShowApplication(true); }}>
          <Icon name="calendar" size={14} color="#1d1d1d" />
          <Text style={s.applyBtnText}> Записаться</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Icon name="back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Результаты поиска</Text>
          <Text style={s.headerSub} numberOfLines={1}>{serviceNames.join(" · ")}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={s.centered}><ActivityIndicator size="large" color="#FFC107" /><Text style={s.loadingText}>Ищем автосервисы...</Text></View>
      ) : error ? (
        <View style={s.centered}><Icon name="warning" size={48} color="#ff6b6b" /><Text style={s.errorText}>{error}</Text></View>
      ) : results.length === 0 ? (
        <View style={s.centered}>
          <Icon name="empty" size={48} color="#888" />
          <Text style={s.emptyTitle}>Ничего не найдено</Text>
          <Text style={s.emptySubText}>Попробуйте выбрать другие услуги</Text>
          <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()}>
            <Text style={s.backButtonText}>Изменить услуги</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
          <Text style={s.countText}>Найдено: {results.length} {results.length === 1 ? "сервис" : results.length < 5 ? "сервиса" : "сервисов"}</Text>
          {results.map((service: any) => <ServiceCard key={service._id} service={service} />)}
        </ScrollView>
      )}

      {/* Детальная модалка */}
      <Modal visible={showDetail} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.cardHeader}>
                <View style={[s.avatar, { width: 64, height: 64, borderRadius: 32 }]}>
                  <Text style={[s.avatarText, { fontSize: 26 }]}>{selectedService?.nameService?.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.serviceName}>{selectedService?.nameService}</Text>
                  {selectedService?.city ? <View style={{ flexDirection:"row", alignItems:"center", gap:4 }}><Icon name="pin" size={12} color="#888" /><Text style={s.serviceCity}>{selectedService.city}</Text></View> : null}
                </View>
                <TouchableOpacity onPress={() => setShowDetail(false)} style={s.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
              </View>
              <View style={s.divider} />
              {selectedService?.address ? <View style={s.infoRow}><Icon name="pin" size={14} color="#888" /><Text style={s.infoText}>{selectedService.address}</Text></View> : null}
              {selectedService?.telephoneNumber ? <View style={s.infoRow}><Icon name="phone" size={14} color="#888" /><Text style={s.infoText}>{selectedService.telephoneNumber}</Text></View> : null}
              {selectedService?.webAddress ? <View style={s.infoRow}><Icon name="globe" size={14} color="#888" /><Text style={[s.infoText, { color: "#3a7bd5" }]}>{selectedService.webAddress}</Text></View> : null}
              {selectedService?.startOfWork && selectedService?.endOfWork && (
                <View style={s.workRow}>
                  <View style={s.workBlock}><Text style={s.workLabel}>Открытие</Text><Text style={s.workVal}>{selectedService.startOfWork}</Text></View>
                  <View style={{ width: 1, backgroundColor: "#444" }} />
                  <View style={s.workBlock}><Text style={s.workLabel}>Закрытие</Text><Text style={s.workVal}>{selectedService.endOfWork}</Text></View>
                </View>
              )}
              {selectedService?.services?.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Text style={s.sectionTitle}>Услуги</Text>
                  <View style={s.tagsContainer}>
                    {selectedService.services.map((sv: string, i: number) => {
                      const price = getServicePriceLabel(selectedService, sv);
                      return (
                        <View key={i} style={[s.tag, serviceNames.includes(sv) && s.tagHL]}>
                          <Text style={[s.tagText, serviceNames.includes(sv) && s.tagTextHL]}>
                            {sv}{price ? ` · ${price}` : ""}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
              {selectedService?.reviews?.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Text style={s.sectionTitle}>Отзывы ({selectedService.reviews.length})</Text>
                  {selectedService.reviews.slice(0, 3).map((r: any, i: number) => (
                    <View key={i} style={s.reviewCard}>
                      <Text style={s.reviewUser}><Icon name="user" size={12} color="#888" /> {r.userName}</Text>
                      <Text style={s.reviewText}>{r.review}</Text>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity style={s.applyBtnLarge} onPress={() => { setShowDetail(false); setShowApplication(true); }}>
                <Icon name="calendar" size={16} color="#1d1d1d" />
                <Text style={s.applyBtnText}> Записаться</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Модалка заявки */}
      <Modal visible={showApplication} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={[s.modalBox, { maxHeight: height * 0.9 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[s.cardHeader, { marginBottom: 4 }]}>
                <Icon name="calendar" size={20} color="#FFC107" />
                <Text style={[s.serviceName, { flex: 1, marginLeft: 8 }]}>Записаться</Text>
                <TouchableOpacity onPress={() => { setShowApplication(false); setAppDate(""); }} style={s.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
              </View>
              <Text style={s.serviceCity}>в {selectedService?.nameService}</Text>
              <View style={s.divider} />
              <Text style={s.sectionTitle}>Выбранные услуги</Text>
              <View style={[s.tagsContainer, { marginBottom: 16 }]}>
                {serviceNames.map((sv: string, i: number) => {
                  const price = getServicePriceLabel(selectedService, sv);
                  return (
                    <View key={i} style={s.tagHL}>
                      <Text style={s.tagTextHL}>
                        {sv}{price ? ` · ${price}` : ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text style={s.sectionTitle}>Дата</Text>
              <CalendarPicker value={appDate} onChange={(d: string) => { setAppDate(d); setAppTime("09:00"); }} />
              <View style={{ marginTop: 16 }}>
                <Text style={s.sectionTitle}>Время</Text>
                <SmartTimePicker value={appTime} onChange={setAppTime} serviceId={selectedService?._id} date={appDate} />
              </View>
              <TouchableOpacity style={s.applyBtnLarge} onPress={handleSendApplication} disabled={isSending}>
                {isSending ? <ActivityIndicator color="#1d1d1d" /> : <><Icon name="send" size={16} color="#1d1d1d" /><Text style={s.applyBtnText}> Отправить заявку</Text></>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d1d" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: "#242424", borderBottomWidth: 1, borderBottomColor: "#333" },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#333", justifyContent: "center", alignItems: "center", marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  headerSub: { fontSize: 12, color: "#888", marginTop: 2 },
  loadingText: { color: "#888", marginTop: 12, fontSize: 15 },
  errorText: { color: "#ff6b6b", fontSize: 16, textAlign: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  emptySubText: { fontSize: 14, color: "#888", textAlign: "center", marginBottom: 24 },
  backButton: { backgroundColor: "#FFC107", borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  backButtonText: { color: "#1d1d1d", fontWeight: "bold", fontSize: 15 },
  countText: { color: "#888", fontSize: 13, marginBottom: 12 },
  card: { backgroundColor: "#2a2a2a", borderRadius: 16, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFC107", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: "bold", color: "#1d1d1d" },
  serviceName: { fontSize: 17, fontWeight: "bold", color: "#fff" },
  serviceCity: { fontSize: 13, color: "#888", marginLeft: 2 },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  infoText: { fontSize: 14, color: "#ccc", flex: 1 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag: { backgroundColor: "#333", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#444" },
  tagHL: { backgroundColor: "#3a2e00", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: "#FFC107" },
  tagText: { color: "#aaa", fontSize: 12 },
  tagTextHL: { color: "#FFC107", fontWeight: "600", fontSize: 12 },
  applyBtn: { marginTop: 14, backgroundColor: "#FFC107", borderRadius: 12, padding: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  applyBtnLarge: { marginTop: 20, backgroundColor: "#FFC107", borderRadius: 14, padding: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 },
  applyBtnText: { color: "#1d1d1d", fontWeight: "bold", fontSize: 15 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#242424", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#333", justifyContent: "center", alignItems: "center" },
  workRow: { flexDirection: "row", marginTop: 12, backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16 },
  workBlock: { flex: 1, alignItems: "center" },
  workLabel: { fontSize: 11, color: "#888", marginBottom: 3, textTransform: "uppercase" },
  workVal: { fontSize: 22, fontWeight: "bold", color: "#FFC107", marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#FFC107", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
  reviewCard: { backgroundColor: "#2a2a2a", borderRadius: 12, padding: 12, marginBottom: 8 },
  reviewUser: { fontSize: 13, color: "#888", marginBottom: 4, flexDirection:"row", alignItems:"center", gap:4 },
  reviewText: { fontSize: 14, color: "#ddd" },
});

export default SearchResults;
