import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Alert, Modal, Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "redux/store";
import { setServiceData, setUserData } from "redux/Slices/UserSlice/registrationUserSlice";
import { baseUrl } from "api/baseUrl";
import Icon from "components/Icon";

const { height } = Dimensions.get("window");

const SERVICES_LIST = [
  "Замена масла","Компьютерная диагностика","Шиномонтаж","Кузовной ремонт",
  "Тормозная система","Электрика","Ремонт двигателя","Топливная система",
  "Фары и оптика","Подвеска","Замена стекла","Коробка передач","Система охлаждения",
];

// ======================== CalendarPicker =========================
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

// ======================== SmartTimePicker =========================
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

  React.useEffect(() => {
    if (!serviceId) { setIsLoadingWorking(false); return; }
    setIsLoadingWorking(true);
    fetch(`${baseUrl}/service/getServiceById`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  React.useEffect(() => {
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

// ======================== ServiceProfile ========================
const ServiceProfile = ({ service, navigation, dispatch }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [city, setCity] = useState(service?.city || "");
  const [telephoneNumber, setTelephoneNumber] = useState(service?.telephoneNumber || "");
  const [webAddress, setWebAddress] = useState(service?.webAddress || "");
  const [address, setAddress] = useState(service?.address || "");
  const [startOfWork, setStartOfWork] = useState(service?.startOfWork || "");
  const [endOfWork, setEndOfWork] = useState(service?.endOfWork || "");
  const [selectedServices, setSelectedServices] = useState<string[]>(service?.services || []);

  const toggleService = (sv: string) =>
    setSelectedServices((prev) => prev.includes(sv) ? prev.filter(x => x !== sv) : [...prev, sv]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/service/updateProfile`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service._id, city, telephoneNumber, webAddress, address, startOfWork, endOfWork, services: selectedServices }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setServiceData(data.service));
        setIsEditing(false);
        Alert.alert("Готово", "Профиль обновлён");
      } else Alert.alert("Ошибка", data.message);
    } catch { Alert.alert("Ошибка", "Проблема с подключением"); }
    finally { setIsSaving(false); }
  };

  const handleCancel = () => {
    setCity(service?.city || "");
    setTelephoneNumber(service?.telephoneNumber || "");
    setWebAddress(service?.webAddress || "");
    setAddress(service?.address || "");
    setStartOfWork(service?.startOfWork || "");
    setEndOfWork(service?.endOfWork || "");
    setSelectedServices(service?.services || []);
    setIsEditing(false);
  };

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      <View style={st.header}>
        <View style={[st.avatarWrap, { backgroundColor: "#FFC107" }]}>
          <Text style={st.avatarText}>{service.nameService?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={st.name}>{service.nameService}</Text>
        <Text style={st.login}>@{service.login}</Text>
        {!isEditing && city ? (<View style={st.locationRow}><Icon name="pin" size={14} color="#aaa" /><Text style={st.locationText}> {city}</Text></View>) : null}
      </View>

      {!isEditing ? (
        <TouchableOpacity style={[st.editButton, { backgroundColor: "#FFC107", borderColor: "#FFC107" }]} onPress={() => setIsEditing(true)}>
          <Icon name="edit" size={16} color="#1d1d1d" />
          <Text style={[st.editButtonText, { color: "#1d1d1d" }]}> Редактировать профиль</Text>
        </TouchableOpacity>
      ) : (
        <View style={[st.editActionsRow, { marginHorizontal: 20, marginBottom: 16 }]}>
          <TouchableOpacity style={st.cancelButton} onPress={handleCancel}><Text style={st.cancelButtonText}>Отмена</Text></TouchableOpacity>
          <TouchableOpacity style={st.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#1d1d1d" /> : <Text style={st.saveButtonText}>Сохранить</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* Остальная часть карточки без изменений */}
      <View style={st.card}>
        <Text style={st.cardTitle}>Контакты</Text>
        {[
          { icon: "pin", label: "Город", value: city, setter: setCity, placeholder: "Город" },
          { icon: "phone", label: "Телефон", value: telephoneNumber, setter: setTelephoneNumber, placeholder: "+7..." },
          { icon: "globe", label: "Сайт", value: webAddress, setter: setWebAddress, placeholder: "https://...", autoCapitalize: "none" },
          { icon: "pin", label: "Адрес", value: address, setter: setAddress, placeholder: "Улица, дом" },
        ].map(({ icon, label, value, setter, placeholder, autoCapitalize }: any) => (
          <View style={st.infoRow} key={label}>
            <Icon name={icon} size={18} color="#888" />
            <View style={st.infoFlex}>
              <Text style={st.infoLabel}>{label}</Text>
              {isEditing
                ? <TextInput style={st.input} value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor="#555" autoCapitalize={autoCapitalize} />
                : <Text style={st.infoValue} numberOfLines={1}>{value || "—"}</Text>}
            </View>
          </View>
        ))}
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Режим работы</Text>
        {isEditing ? (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}><Text style={st.infoLabel}>Открытие</Text>
              <TextInput style={[st.input, { textAlign: "center", fontSize: 18 }]} value={startOfWork} onChangeText={setStartOfWork} placeholder="09:00" placeholderTextColor="#555" /></View>
            <Text style={{ color: "#555", fontSize: 20, marginTop: 20 }}>—</Text>
            <View style={{ flex: 1 }}><Text style={st.infoLabel}>Закрытие</Text>
              <TextInput style={[st.input, { textAlign: "center", fontSize: 18 }]} value={endOfWork} onChangeText={setEndOfWork} placeholder="18:00" placeholderTextColor="#555" /></View>
          </View>
        ) : (
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center", flex: 1 }}><Text style={st.infoLabel}>ОТКРЫТИЕ</Text><Text style={{ fontSize: 22, fontWeight: "bold", color: "#FFC107" }}>{startOfWork || "—"}</Text></View>
            <View style={{ width: 1, height: 40, backgroundColor: "#444" }} />
            <View style={{ alignItems: "center", flex: 1 }}><Text style={st.infoLabel}>ЗАКРЫТИЕ</Text><Text style={{ fontSize: 22, fontWeight: "bold", color: "#FFC107" }}>{endOfWork || "—"}</Text></View>
          </View>
        )}
      </View>

      <View style={st.card}>
        <Text style={st.cardTitle}>Услуги</Text>
        <View style={st.tagsContainer}>
          {isEditing
            ? SERVICES_LIST.map((sv) => (
              <TouchableOpacity key={sv} onPress={() => toggleService(sv)} style={[st.tag, selectedServices.includes(sv) && st.tagActive]}>
                <Text style={[st.tagText, selectedServices.includes(sv) && st.tagTextActive]}>{selectedServices.includes(sv) ? <Icon name="check" size={12} color="#1d1d1d" /> : null} {sv}</Text>
              </TouchableOpacity>
            ))
            : selectedServices.length > 0
              ? selectedServices.map((sv, i) => <View key={i} style={st.tag}><Text style={st.tagText}>{sv}</Text></View>)
              : <Text style={st.infoValue}>Не указаны</Text>}
        </View>
      </View>

      <View style={st.statsRow}>
        {[
          { n: service.reviews?.length || 0, l: "Отзывов" },
          { n: service.declaration?.length || 0, l: "Заявок" },
          { n: selectedServices.length, l: "Услуг" }
        ].map(({ n, l }) => (
          <View key={l} style={st.statCard}><Text style={st.statNumber}>{n}</Text><Text style={st.statLabel}>{l}</Text></View>
        ))}
      </View>

      <TouchableOpacity style={st.logoutButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Auth" }] })}>
        <Icon name="logout" size={18} color="#ff4444" />
        <Text style={st.logoutText}> Выйти из аккаунта</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// ======================== UserProfile ========================
const UserProfile = ({ user, navigation, dispatch }: any) => {
  // Редактирование авто
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [isSavingCar, setIsSavingCar] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [carBrand, setCarBrand] = useState(user?.carBrand || "");
  const [carModel, setCarModel] = useState(user?.carModel || "");
  const [carYear, setCarYear] = useState(user?.carYear || "");
  const [carNumber, setCarNumber] = useState(user?.carNumber || "");
  const [vinNumber, setVinNumber] = useState(user?.vinNumber || "");

  // Редактирование профиля (личные данные)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [city, setCity] = useState(user?.city || "");
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

const formatDateToDMY = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}.${month}.${year}`;
  }
  return dateStr; // fallback
};

const formatDateToYMD = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [favServices, setFavServices] = useState<any[]>([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [detailService, setDetailService] = useState<any>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedForApp, setSelectedForApp] = useState<any>(null);
  const [chosenServices, setChosenServices] = useState<string[]>([]);
  const [appDate, setAppDate] = useState("");
  const [appTime, setAppTime] = useState("09:00");
  const [isSending, setIsSending] = useState(false);

  const favorites: string[] = user?.favorites || [];
  const searchHistory: string[] = user?.searchHistory || [];
  const headerName = displayName || user?.login || "Пользователь";

  const toggleChosenService = (sv: string) =>
    setChosenServices((prev) => prev.includes(sv) ? prev.filter(x => x !== sv) : [...prev, sv]);

  const carInfo = { phone, carBrand, carModel, carYear, carNumber, vinNumber, displayName, bio, city, birthDate };
  const hasCarInfo = !!phone || !!carBrand || !!carModel || !!carYear || !!carNumber || !!vinNumber;

  const openApplication = (service: any) => {
    setSelectedForApp(service);
    setChosenServices([]);
    setAppDate("");
    setAppTime("09:00");
    setShowServiceDetail(false);
    setShowApplication(true);
  };

  const handleSendApplication = async () => {
    if (!user) return;
    if (chosenServices.length === 0) { Alert.alert("Выберите услуги", "Выберите хотя бы одну услугу"); return; }
    if (!appDate) { Alert.alert("Выберите дату", "Выберите дату в календаре"); return; }
    setIsSending(true);
    try {
      const res1 = await fetch(`${baseUrl}/service/sendApplication`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedForApp._id, login: user.login, listAssistances: chosenServices, date: appDate, time: appTime, carInfo }),
      });
      const data1 = await res1.json();
      if (!res1.ok) { Alert.alert("Ошибка", data1.message); setIsSending(false); return; }
      const res2 = await fetch(`${baseUrl}/user/addMyApplication`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login, serviceId: selectedForApp._id, serviceName: selectedForApp.nameService, listAssistances: chosenServices, date: appDate, time: appTime, declarationId: data1.declarationId, carInfo }),
      });
      const data2 = await res2.json();
      if (res2.ok) dispatch(setUserData({ ...user, myApplications: data2.myApplications }));
      Alert.alert("Готово! 🎉", `Заявка в ${selectedForApp.nameService} на ${appDate} в ${appTime} отправлена!`);
      setShowApplication(false);
    } catch { Alert.alert("Ошибка", "Проблема с подключением"); }
    finally { setIsSending(false); }
  };

  const handleSaveCar = async () => {
    setIsSavingCar(true);
    try {
      const res = await fetch(`${baseUrl}/user/updateProfile`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login, phone, carBrand, carModel, carYear, carNumber, vinNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setUserData({ ...user, ...data.user }));
        setIsEditingCar(false);
        Alert.alert("Готово", "Данные авто сохранены");
      } else Alert.alert("Ошибка", data.message);
    } catch { Alert.alert("Ошибка", "Проблема с подключением"); }
    finally { setIsSavingCar(false); }
  };
  
  const validateName = (name: string): boolean => {
  if (!name.trim()) return false;
  if (name.trim().length < 2) return false;
  // Разрешены: буквы (кириллица и латиница), пробел, дефис, апостроф
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
  return nameRegex.test(name);
};

  const handleSaveProfile = async () => {
  // Валидация имени (если поле не пустое)
  if (displayName && !validateName(displayName)) {
    Alert.alert(
      "Ошибка",
      "Имя должно содержать только буквы, пробелы, дефис или апостроф (минимум 2 символа). Цифры и другие символы запрещены."
    );
    return;
  }

  setIsSavingProfile(true);
  try {
    const res = await fetch(`${baseUrl}/user/updateProfile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: user.login, displayName, bio, city, birthDate }),
    });
    const data = await res.json();
    if (res.ok) {
      dispatch(setUserData({ ...user, ...data.user }));
      setIsEditingProfile(false);
      Alert.alert("Готово", "Профиль обновлён");
    } else {
      Alert.alert("Ошибка", data.message);
    }
  } catch (err) {
    Alert.alert("Ошибка", "Проблема с подключением");
  } finally {
    setIsSavingProfile(false);
  }
};

  const loadFavoriteServices = async () => {
    setIsLoadingFavs(true);
    try {
      const res = await fetch(`${baseUrl}/user/getFavoriteServices`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login }),
      });
      const data = await res.json();
      setFavServices(res.ok ? data.services || [] : []);
    } catch { setFavServices([]); }
    finally { setIsLoadingFavs(false); }
  };

  const removeFavorite = async (serviceId: string) => {
    try {
      const res = await fetch(`${baseUrl}/user/removeFavorite`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: user.login, serviceId }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(setUserData({ ...user, favorites: data.favorites }));
        setFavServices((prev) => prev.filter(s => s._id !== serviceId));
      }
    } catch { }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setBirthDate(formatted);
    }
  };

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      {/* Шапка */}
      <View style={st.userHeader}>
        <View style={[st.avatarWrap, { backgroundColor: "#3a7bd5" }]}>
          <Text style={st.avatarText}>{headerName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={st.name}>{headerName}</Text>
        <View style={st.userBadge}><Text style={st.userBadgeText}>Пользователь</Text></View>
      </View>

      {/* Кнопка редактирования авто */}
      {!isEditingCar ? (
        <TouchableOpacity style={[st.editButton, { borderColor: "#3a7bd5" }]} onPress={() => setIsEditingCar(true)}>
          <Icon name="car" size={18} color="#3a7bd5" />
          <Text style={[st.editButtonText, { color: "#3a7bd5" }]}> Редактировать авто</Text>
        </TouchableOpacity>
      ) : (
        <View style={st.card}>
          <Text style={st.cardTitle}>Моё авто</Text>
          {[
            { icon: "phone", label: "Телефон", value: phone, setter: setPhone, placeholder: "+7..." },
            { icon: "car", label: "Марка", value: carBrand, setter: setCarBrand, placeholder: "Toyota" },
            { icon: "car", label: "Модель", value: carModel, setter: setCarModel, placeholder: "Camry" },
            { icon: "calendar", label: "Год", value: carYear, setter: setCarYear, placeholder: "2018", keyboardType: "number-pad" },
            { icon: "car", label: "Гос. номер", value: carNumber, setter: setCarNumber, placeholder: "А123БВ 77", autoCapitalize: "characters" },
            { icon: "pin", label: "VIN-номер", value: vinNumber, setter: setVinNumber, placeholder: "WVWZZZ1JZ3W386752", autoCapitalize: "characters" },
          ].map(({ icon, label, value, setter, placeholder, keyboardType, autoCapitalize }: any) => (
            <View style={st.infoRow} key={label}>
              <Icon name={icon} size={18} color="#888" />
              <View style={st.infoFlex}>
                <Text style={st.infoLabel}>{label}</Text>
                <TextInput style={st.input} value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor="#555" keyboardType={keyboardType} autoCapitalize={autoCapitalize} />
              </View>
            </View>
          ))}
          <View style={st.editActionsRow}>
            <TouchableOpacity style={st.cancelButton} onPress={() => { setIsEditingCar(false); setPhone(user?.phone || ""); setCarBrand(user?.carBrand || ""); setCarModel(user?.carModel || ""); setCarYear(user?.carYear || ""); setCarNumber(user?.carNumber || ""); setVinNumber(user?.vinNumber || ""); }}>
              <Text style={st.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[st.saveButton, { backgroundColor: "#3a7bd5" }]} onPress={handleSaveCar} disabled={isSavingCar}>
              {isSavingCar ? <ActivityIndicator color="#fff" /> : <Text style={st.saveButtonText}>Сохранить</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Отображение сохранённых данных об авто */}
      {!isEditingCar && hasCarInfo && (
        <View style={st.card}>
          <Text style={st.cardTitle}>Моё авто</Text>
          {phone ? (<View style={st.infoRow}><Icon name="phone" size={18} color="#888" /><View style={st.infoFlex}><Text style={st.infoLabel}>Телефон</Text><Text style={st.infoValue}>{phone}</Text></View></View>) : null}
          {(carBrand || carModel || carYear) ? (<View style={st.infoRow}><Icon name="car" size={18} color="#888" /><View style={st.infoFlex}><Text style={st.infoLabel}>Автомобиль</Text><Text style={st.infoValue}>{[carBrand, carModel, carYear].filter(Boolean).join(" ")}</Text></View></View>) : null}
          {carNumber ? (<View style={st.infoRow}><Icon name="car" size={18} color="#888" /><View style={st.infoFlex}><Text style={st.infoLabel}>Гос. номер</Text><Text style={st.infoValue}>{carNumber}</Text></View></View>) : null}
          {vinNumber ? (<View style={st.infoRow}><Icon name="pin" size={18} color="#888" /><View style={st.infoFlex}><Text style={st.infoLabel}>VIN-номер</Text><Text style={st.infoValue}>{vinNumber}</Text></View></View>) : null}
        </View>
      )}

      {/* Кнопка и форма редактирования профиля */}
{!isEditingProfile ? (
  <TouchableOpacity style={[st.editButton, { borderColor: "#FFC107", marginTop: 8 }]} onPress={() => setIsEditingProfile(true)}>
    <Icon name="edit" size={18} color="#FFC107" />
    <Text style={[st.editButtonText, { color: "#FFC107" }]}> Редактировать профиль</Text>
  </TouchableOpacity>
) : (
  <View style={st.card}>
    <Text style={st.cardTitle}>Редактировать профиль</Text>

    <View style={st.infoRow}>
      <Icon name="user" size={18} color="#888" />
      <View style={st.infoFlex}>
        <Text style={st.infoLabel}>Имя</Text>
        <TextInput
          style={st.input}
          placeholder="Имя"
          placeholderTextColor="#555"
          value={displayName}
          onChangeText={(text) => {
            const filtered = text.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-']/g, '');
            setDisplayName(filtered);
          }}
          autoCapitalize="words"
          maxLength={50}
        />
      </View>
    </View>

    <View style={st.infoRow}>
      <Icon name="clipboard" size={18} color="#888" />
      <View style={st.infoFlex}>
        <Text style={st.infoLabel}>О себе</Text>
        <TextInput style={[st.input, { minHeight: 60, textAlignVertical: "top" }]} placeholder="О себе" placeholderTextColor="#555" value={bio} onChangeText={setBio} multiline />
      </View>
    </View>

    <View style={st.infoRow}>
      <Icon name="pin" size={18} color="#888" />
      <View style={st.infoFlex}>
        <Text style={st.infoLabel}>Город</Text>
        <TextInput style={st.input} placeholder="Город" placeholderTextColor="#555" value={city} onChangeText={setCity} />
      </View>
    </View>

    <View style={st.infoRow}>
      <Icon name="calendar" size={18} color="#888" />
      <View style={st.infoFlex}>
        <Text style={st.infoLabel}>Дата рождения</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View style={st.input}>
            <Text style={{ color: birthDate ? "#fff" : "#888" }}>
              {birthDate ? formatDateToDMY(birthDate) : "Дата рождения"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

    {showDatePicker && (
      <DateTimePicker
        value={birthDate ? new Date(birthDate) : new Date()}
        mode="date"
        display="default"
        onChange={onDateChange}
      />
    )}

    <View style={st.editActionsRow}>
      <TouchableOpacity style={st.cancelButton} onPress={() => {
        setIsEditingProfile(false);
        setDisplayName(user?.displayName || "");
        setBio(user?.bio || "");
        setCity(user?.city || "");
        setBirthDate(user?.birthDate || "");
      }}>
        <Text style={st.cancelButtonText}>Отмена</Text>
      </TouchableOpacity>
      <TouchableOpacity style={st.saveButton} onPress={handleSaveProfile} disabled={isSavingProfile}>
        {isSavingProfile ? <ActivityIndicator color="#1d1d1d" /> : <Text style={st.saveButtonText}>Сохранить</Text>}
      </TouchableOpacity>
    </View>
  </View>
)}

      {/* Карточка аккаунта (отображается только если не редактируем) */}
      {!isEditingProfile && (
        <View style={st.card}>
          <Text style={st.cardTitle}>Аккаунт</Text>
          {displayName ? (
            <View style={st.infoRow}>
              <Icon name="user" size={18} color="#888" />
              <View style={st.infoFlex}><Text style={st.infoLabel}>Имя</Text><Text style={st.infoValue}>{displayName}</Text></View>
            </View>
          ) : null}
          {bio ? (
            <View style={st.infoRow}>
              <Icon name="clipboard" size={18} color="#888" />
              <View style={st.infoFlex}><Text style={st.infoLabel}>О себе</Text><Text style={st.infoValue}>{bio}</Text></View>
            </View>
          ) : null}
          {city ? (
            <View style={st.infoRow}>
              <Icon name="pin" size={18} color="#888" />
              <View style={st.infoFlex}><Text style={st.infoLabel}>Город</Text><Text style={st.infoValue}>{city}</Text></View>
            </View>
          ) : null}
          {birthDate ? (
  <View style={st.infoRow}>
    <Icon name="calendar" size={18} color="#888" />
    <View style={st.infoFlex}><Text style={st.infoLabel}>Дата рождения</Text><Text style={st.infoValue}>{formatDateToDMY(birthDate)}</Text></View>
  </View>
) : null}
          <View style={st.infoRow}>
            <Icon name="globe" size={18} color="#888" />
            <View style={st.infoFlex}><Text style={st.infoLabel}>Email</Text><Text style={st.infoValue}>{user?.login}</Text></View>
          </View>
        </View>
      )}

      {/* Возможности */}
      <View style={st.card}>
        <Text style={st.cardTitle}>Возможности</Text>
        <TouchableOpacity style={st.menuItem} onPress={() => { loadFavoriteServices(); setShowFavorites(true); }}>
          <Icon name="heart" size={20} color="#FFC107" />
          <View style={st.infoFlex}><Text style={st.menuLabel}>Избранные сервисы</Text><Text style={st.menuSub}>Сохранённые автосервисы ({favorites.length})</Text></View>
          <Icon name="back" size={16} color="#555" style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={st.menuItem} onPress={() => setShowHistory(true)}>
          <Icon name="history" size={20} color="#FFC107" />
          <View style={st.infoFlex}><Text style={st.menuLabel}>История поиска</Text><Text style={st.menuSub}>Недавние запросы ({searchHistory.length})</Text></View>
          <Icon name="back" size={16} color="#555" style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity> */}
        {/* <View style={[st.menuItem, { borderBottomWidth: 0 }]}>
          <Icon name="eye" size={20} color="#FFC107" />
          <View style={st.infoFlex}><Text style={st.menuLabel}>Уведомления</Text><Text style={st.menuSub}>{notifications ? "Включены" : "Выключены"}</Text></View>
          <TouchableOpacity style={[st.toggle, notifications && st.toggleOn]} onPress={() => setNotifications(!notifications)}>
            <View style={[st.toggleDot, notifications && st.toggleDotOn]} />
          </TouchableOpacity>
        </View> */}
      </View>

      <View style={st.statsRow}>
        {[
          { n: favorites.length, l: "Избранных", c: "#3a7bd5" },
          { n: searchHistory.length, l: "Запросов", c: "#3a7bd5" },
          { n: user?.myApplications?.length || 0, l: "Заявок", c: "#3a7bd5" }
        ].map(({ n, l, c }) => (
          <View key={l} style={st.statCard}><Text style={[st.statNumber, { color: c }]}>{n}</Text><Text style={st.statLabel}>{l}</Text></View>
        ))}
      </View>

      <TouchableOpacity style={st.logoutButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Auth" }] })}>
        <Icon name="logout" size={18} color="#ff4444" />
        <Text style={st.logoutText}> Выйти из аккаунта</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />

      {/* Модалки (избранное, детали сервиса, запись, история) */}
      <Modal visible={showFavorites} animationType="slide" transparent>
        <View style={st.overlay}>
          <View style={st.modalBox}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Icon name="heart" size={20} color="#FFC107" />
              <Text style={[st.name, { flex: 1, fontSize: 18, marginLeft: 8 }]}> Избранные</Text>
              <TouchableOpacity onPress={() => setShowFavorites(false)} style={st.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
            </View>
            {isLoadingFavs ? <ActivityIndicator color="#FFC107" style={{ marginTop: 20 }} /> :
              favServices.length === 0 ? <Text style={st.emptyText}>Нет избранных сервисов{"\n"}Добавьте сервис нажав <Icon name="heart-outline" size={14} color="#888" /> в результатах поиска</Text> :
                <ScrollView>
                  {favServices.map((fav: any) => (
                    <View key={fav._id} style={st.favItem}>
                      <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center" }} onPress={() => { setDetailService(fav); setShowFavorites(false); setShowServiceDetail(true); }}>
                        <View style={[st.avatarWrap, { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: "#FFC107" }]}>
                          <Text style={{ fontWeight: "bold", color: "#1d1d1d", fontSize: 18 }}>{fav.nameService?.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={st.infoValue}>{fav.nameService}</Text>
                          {fav.city ? <Text style={{ color: "#888", fontSize: 12 }}><Icon name="pin" size={10} color="#888" /> {fav.city}</Text> : null}
                          {fav.services?.length > 0 ? <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }} numberOfLines={1}>{fav.services.slice(0, 3).join(" · ")}{fav.services.length > 3 ? " ..." : " "}</Text> : null}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={st.favApplyBtn} onPress={() => { setShowFavorites(false); openApplication(fav); }}>
                        <Text style={st.favApplyText}>Записаться</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeFavorite(fav._id)} style={{ padding: 8 }}><Icon name="close" size={18} color="#ff4444" /></TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
            }
          </View>
        </View>
      </Modal>

      <Modal visible={showServiceDetail} animationType="slide" transparent>
        <View style={st.overlay}>
          <View style={st.modalBox}>
            <ScrollView>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={[st.avatarWrap, { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFC107", marginRight: 12 }]}>
                  <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1d1d1d" }}>{detailService?.nameService?.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}><Text style={st.name}>{detailService?.nameService}</Text>{detailService?.city ? <Text style={{ color: "#888", fontSize: 13 }}><Icon name="pin" size={12} color="#888" /> {detailService.city}</Text> : null}</View>
                <TouchableOpacity onPress={() => setShowServiceDetail(false)} style={st.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
              </View>
              <View style={{ height: 1, backgroundColor: "#333", marginBottom: 12 }} />
              {detailService?.address ? <View style={st.infoRow}><Icon name="pin" size={16} color="#888" /><Text style={[st.infoValue, { fontSize: 14 }]}>{detailService.address}</Text></View> : null}
              {detailService?.telephoneNumber ? <View style={st.infoRow}><Icon name="phone" size={16} color="#888" /><Text style={[st.infoValue, { fontSize: 14 }]}>{detailService.telephoneNumber}</Text></View> : null}
              {detailService?.webAddress ? <View style={st.infoRow}><Icon name="globe" size={16} color="#888" /><Text style={[st.infoValue, { fontSize: 14, color: "#3a7bd5" }]}>{detailService.webAddress}</Text></View> : null}
              {detailService?.startOfWork && detailService?.endOfWork ? (
                <View style={{ flexDirection: "row", backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16, marginTop: 8 }}>
                  <View style={{ flex: 1, alignItems: "center" }}><Text style={st.infoLabel}>ОТКРЫТИЕ</Text><Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFC107" }}>{detailService.startOfWork}</Text></View>
                  <View style={{ width: 1, backgroundColor: "#444" }} />
                  <View style={{ flex: 1, alignItems: "center" }}><Text style={st.infoLabel}>ЗАКРЫТИЕ</Text><Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFC107" }}>{detailService.endOfWork}</Text></View>
                </View>
              ) : null}
              {detailService?.services?.length > 0 ? (
                <View style={{ marginTop: 16 }}><Text style={[st.cardTitle, { marginBottom: 10 }]}>Услуги</Text><View style={st.tagsContainer}>{detailService.services.map((sv: string, i: number) => <View key={i} style={st.tag}><Text style={st.tagText}>{sv}</Text></View>)}</View></View>
              ) : null}
              <TouchableOpacity style={[st.saveButton, { marginTop: 20, padding: 16 }]} onPress={() => openApplication(detailService)}>
                <Icon name="calendar" size={16} color="#1d1d1d" />
                <Text style={st.saveButtonText}> Записаться</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showApplication} animationType="slide" transparent>
        <View style={st.overlay}>
          <View style={[st.modalBox, { maxHeight: height * 0.9 }]}>
            <ScrollView>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Icon name="calendar" size={20} color="#FFC107" />
                <Text style={[st.name, { flex: 1, fontSize: 18, marginLeft: 8 }]}> Записаться</Text>
                <TouchableOpacity onPress={() => setShowApplication(false)} style={st.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
              </View>
              <Text style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>в {selectedForApp?.nameService}</Text>
              <Text style={st.cardTitle}>Выберите услуги</Text>
              {selectedForApp?.services?.length > 0 ? (
                <View style={[st.tagsContainer, { marginBottom: 16 }]}>
                  {selectedForApp.services.map((sv: string, i: number) => {
                    const active = chosenServices.includes(sv);
                    return (
                      <TouchableOpacity key={i} onPress={() => toggleChosenService(sv)} style={[st.tag, active && st.tagActive]}>
                        <Text style={[st.tagText, active && st.tagTextActive]}>{active ? <Icon name="check" size={12} color="#1d1d1d" /> : null} {sv}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : <Text style={[st.emptyText, { marginBottom: 16 }]}>У этого сервиса нет услуг</Text>}
              <Text style={st.cardTitle}>Дата</Text>
              <CalendarPicker value={appDate} onChange={(d: string) => { setAppDate(d); setAppTime("09:00"); }} />
              <View style={{ marginTop: 16 }}><Text style={st.cardTitle}>Время</Text><SmartTimePicker value={appTime} onChange={setAppTime} serviceId={selectedForApp?._id} date={appDate} /></View>
              <TouchableOpacity style={[st.saveButton, { marginTop: 20, padding: 16 }, chosenServices.length === 0 && { opacity: 0.5 }]} onPress={handleSendApplication} disabled={isSending || chosenServices.length === 0}>
                {isSending ? <ActivityIndicator color="#1d1d1d" /> : <><Icon name="send" size={16} color="#1d1d1d" /><Text style={st.saveButtonText}> Отправить заявку</Text></>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* <Modal visible={showHistory} animationType="slide" transparent>
        <View style={st.overlay}>
          <View style={st.modalBox}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <Icon name="history" size={20} color="#FFC107" />
              <Text style={[st.name, { flex: 1, fontSize: 18, marginLeft: 8 }]}> История поиска</Text> 
              <TouchableOpacity onPress={() => setShowHistory(false)} style={st.closeBtn}><Icon name="close" size={16} color="#aaa" /></TouchableOpacity>
            </View>
            {searchHistory.length === 0 ? <Text style={st.emptyText}>История пуста</Text> :
              <>
                {searchHistory.map((q: string, i: number) => (
                  <View key={i} style={st.historyItem}><Icon name="search" size={14} color="#888" /><Text style={[st.infoValue, { flex: 1, marginLeft: 8 }]}>{q}</Text></View>
                ))}
                <TouchableOpacity style={[st.logoutButton, { marginTop: 16, marginHorizontal: 0 }]} onPress={() => dispatch(setUserData({ ...user, searchHistory: [] }))}>
                  <Text style={st.logoutText}>Очистить историю</Text>
                </TouchableOpacity>
              </>
            }
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

// ======================== Main Profile ========================
const Profile = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const serviceData = useAppSelector((state: any) => state.registrationUser.service);
  const userData = useAppSelector((state: any) => state.registrationUser.user);
  if (serviceData) return <ServiceProfile service={serviceData} navigation={navigation} dispatch={dispatch} />;
  if (userData) return <UserProfile user={userData} navigation={navigation} dispatch={dispatch} />;
  return <View style={st.centered}><Text style={st.emptyText}>Нет данных профиля</Text></View>;
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d1d" },
  centered: { flex: 1, backgroundColor: "#1d1d1d", justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 15, textAlign: "center", lineHeight: 24 },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  userHeader: { alignItems: "center", paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  avatarWrap: { width: 90, height: 90, borderRadius: 45, justifyContent: "center", alignItems: "center", marginBottom: 16, elevation: 8 },
  avatarText: { fontSize: 36, fontWeight: "bold", color: "#1d1d1d" },
  name: { fontSize: 24, fontWeight: "bold", color: "#ffffff", marginBottom: 4 },
  login: { fontSize: 14, color: "#888", marginBottom: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  locationText: { fontSize: 14, color: "#aaa" },
  userBadge: { backgroundColor: "#1a3a5c", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8, borderWidth: 1, borderColor: "#3a7bd5" },
  userBadgeText: { color: "#3a7bd5", fontSize: 13, fontWeight: "600" },
  editButton: { marginHorizontal: 20, marginBottom: 16, backgroundColor: "#2a2a2a", borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, flexDirection: "row", justifyContent: "center" },
  editButtonText: { fontSize: 15, fontWeight: "600", marginLeft: 6 },
  editActionsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, backgroundColor: "#2a2a2a", borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#555" },
  cancelButtonText: { color: "#aaa", fontSize: 15, fontWeight: "600" },
  saveButton: { flex: 1, backgroundColor: "#FFC107", borderRadius: 14, padding: 14, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  saveButtonText: { color: "#1d1d1d", fontSize: 15, fontWeight: "bold" },
  card: { backgroundColor: "#2a2a2a", borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: "bold", color: "#FFC107", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1.2 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  infoFlex: { flex: 1, marginLeft: 12 },
  infoLabel: { fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  infoValue: { fontSize: 15, color: "#ffffff" },
  input: { backgroundColor: "#1d1d1d", borderRadius: 10, padding: 10, color: "#ffffff", fontSize: 15, borderWidth: 1, borderColor: "#444", marginBottom: 14 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#3a3a3a", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: "#444" },
  tagActive: { backgroundColor: "#FFC107", borderColor: "#FFC107" },
  tagText: { color: "#ddd", fontSize: 13 },
  tagTextActive: { color: "#1d1d1d", fontWeight: "bold" },
  statsRow: { flexDirection: "row", marginHorizontal: 20, marginBottom: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: "#2a2a2a", borderRadius: 16, padding: 16, alignItems: "center" },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#FFC107" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#333" },
  menuLabel: { fontSize: 15, color: "#ffffff", marginBottom: 2 },
  menuSub: { fontSize: 12, color: "#666" },
  toggle: { width: 48, height: 26, borderRadius: 13, backgroundColor: "#333", justifyContent: "center", padding: 2 },
  toggleOn: { backgroundColor: "#3a7bd5" },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#888" },
  toggleDotOn: { backgroundColor: "#fff", alignSelf: "flex-end" },
  logoutButton: { marginHorizontal: 20, marginTop: 8, backgroundColor: "#2a2a2a", borderRadius: 16, padding: 18, alignItems: "center", borderWidth: 1, borderColor: "#ff4444", flexDirection: "row", justifyContent: "center" },
  logoutText: { color: "#ff4444", fontSize: 16, fontWeight: "600" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#242424", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: height * 0.85 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#333", justifyContent: "center", alignItems: "center" },
  favItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#333" },
  favApplyBtn: { backgroundColor: "#FFC107", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6 },
  favApplyText: { color: "#1d1d1d", fontWeight: "bold", fontSize: 12 },
  historyItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#333" },
  datePickerButton: { marginBottom: 14 },
});

export default Profile;