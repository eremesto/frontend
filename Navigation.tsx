import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector, useAppDispatch } from "redux/store";
import { setServiceData, setUserData } from "redux/Slices/UserSlice/registrationUserSlice";
import { baseUrl } from "api/baseUrl";
import Auth from "pages/Auth/Auth";
import Services from "pages/Services/Services";
import Registration from "pages/Registration/Registration";
import Profile from "pages/Profile/Profile";
import SearchResults from "pages/SearchResults/SearchResults";
import Chat from "pages/Chat/Chat";
import Icon from "components/Icon";
import ForgotPassword from "pages/Auth/ForgotPassword";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Registration: undefined;
  SearchResults: { selectedServices: { id: string; name: string }[] };
  Chat: { applicationId: string; serviceName: string; interlocutorLogin: string };
  ForgotPassword: undefined;   
};

export type NavigationType = {
  navigation: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const formatDate = (date: string | Date): string => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const Badge = ({ count }: { count: number }) => {
  if (!count) return null;
  return (
    <View style={bd.badge}>
      <Text style={bd.badgeText}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
};

const bd = StyleSheet.create({
  badge: {
    position: "absolute", top: -4, right: -8,
    backgroundColor: "#ff3b30", borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: "center", alignItems: "center",
    paddingHorizontal: 4, borderWidth: 1.5, borderColor: "#242424",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});


const TabBar = ({ tabs, activeTab, setActiveTab, accentColor = "#FFC107", badges = {} }: any) => (
  <View style={tb.container}>
    {tabs.map((tab: any) => {
      const active = activeTab === tab.name;
      const badgeCount = badges[tab.name] || 0;
      let iconName: any = "";
      if (tab.name === "Services") iconName = "wrench";
      else if (tab.name === "Requests") iconName = "clipboard";
      else if (tab.name === "Profile") iconName = tab.isService ? "store" : "user";
      else iconName = "user";
      return (
        <TouchableOpacity key={tab.name} style={tb.tab} onPress={() => setActiveTab(tab.name)} activeOpacity={0.7}>
          <View style={{ position: "relative" }}>
            <Icon name={iconName} size={22} color={active ? accentColor : "#666"} />
            <Badge count={badgeCount} />
          </View>
          <Text style={[tb.label, active && { color: accentColor, fontWeight: "600" }]}>{tab.label}</Text>
          {active && <View style={[tb.dot, { backgroundColor: accentColor }]} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

const UserRequestsScreen = ({ navigation, onUnreadChange }: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.registrationUser.user);
  const applications = user?.myApplications || [];
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [unreadMap, setUnreadMap] = React.useState<Record<string, number>>({});
  const active = applications.filter((a: any) => a.status !== "done");
  const done = applications.filter((a: any) => a.status === "done");
  const [showDone, setShowDone] = React.useState(false);

  const fetchUnread = React.useCallback(async () => {
    const ids = applications.map((a: any) => a.declarationId || a._id).filter(Boolean);
    if (!ids.length || !user?.login) return;
    try {
      const res = await fetch(`${baseUrl}/chat/unread`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: ids, myLogin: user.login }),
      });
      const data = await res.json();
      if (res.ok) {
        setUnreadMap(data.unread || {});
        const total = Object.values(data.unread || {}).reduce((s: any, v: any) => s + v, 0);
        onUnreadChange?.(total as number);
      }
    } catch {}
  }, [applications, user?.login]);

  React.useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const cancelApplication = (app: any) => {
    Alert.alert(
      "Отменить заявку?",
      `Заявка в ${app.serviceName} на ${formatDate(app.date)} в ${app.time} будет удалена.`,
      [
        { text: "Назад", style: "cancel" },
        {
          text: "Удалить", style: "destructive", onPress: async () => {
            setCancellingId(app.declarationId || app._id);
            try {
              const res = await fetch(`${baseUrl}/user/cancelApplication`, {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: user.login, declarationId: app.declarationId || app._id }),
              });
              const data = await res.json();
              if (res.ok) dispatch(setUserData({ ...user, myApplications: data.myApplications }));
              else Alert.alert("Ошибка", data.message || "Не удалось отменить заявку");
            } catch (e) { Alert.alert("Ошибка", "Проблема с подключением"); }
            finally { setCancellingId(null); }
          }
        }
      ]
    );
  };

  const AppCard = ({ app }: any) => {
    const isDone = app.status === "done";
    const isCancelling = cancellingId === (app.declarationId || app._id);
    const appId = app.declarationId || app._id;
    const unread = unreadMap[appId] || 0;

    return (
      <View style={[rq.card, isDone && { opacity: 0.6 }]}>
        <View style={rq.cardHeader}>
          <View style={[rq.avatar, { backgroundColor: "#FFC107" }]}>
            <Text style={[rq.avatarText, { color: "#1d1d1d" }]}>{app.serviceName?.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={rq.clientName}>{app.serviceName}</Text>
            <Text style={rq.dateText}>
              <Icon name="calendar" size={12} color="#888" /> {formatDate(app.date)} в {app.time}
            </Text>
          </View>
          <View style={[rq.statusBadge, isDone ? rq.statusBadgeDone : rq.statusBadgeNew]}>
            {isDone ? <Icon name="check" size={12} color="#666" /> : <Icon name="circle-dot" size={12} color="#4caf50" />}
            <Text style={[rq.statusText, isDone ? rq.statusTextDone : rq.statusTextNew]}>
              {isDone ? " Выполнена" : " Активна"}
            </Text>
          </View>
        </View>
        {app.listAssistances?.length > 0 && (
          <View style={rq.tagsRow}>
            {app.listAssistances.map((sv: string, j: number) => (
              <View key={j} style={rq.tag}><Text style={rq.tagText}>{sv}</Text></View>
            ))}
          </View>
        )}
        <View style={rq.cardActions}>
          <TouchableOpacity
            style={[rq.chatBtn, unread > 0 && rq.chatBtnUnread]}
            onPress={() => {
              setUnreadMap(prev => { const n = {...prev}; delete n[appId]; return n; });
              navigation.navigate("Chat", { applicationId: appId, serviceName: app.serviceName, interlocutorLogin: app.serviceName });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="chat" size={16} color={unread > 0 ? "#fff" : "#3a7bd5"} />
              <Text style={[rq.chatBtnText, unread > 0 && { color: "#fff" }]}>Написать сервису</Text>
              {unread > 0 && <Badge count={unread} />}
            </View>
          </TouchableOpacity>
          {!isDone && (
            <TouchableOpacity style={rq.cancelBtn} onPress={() => cancelApplication(app)} disabled={isCancelling}>
              {isCancelling ? <ActivityIndicator color="#ff4444" size="small" /> : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Icon name="close" size={14} color="#ff4444" />
                  <Text style={rq.cancelBtnText}>Отменить</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1d1d1d" }}>
      <View style={rq.header}>
        <Text style={rq.headerTitle}>
          <Icon name="clipboard" size={20} color="#fff" /> Мои заявки
        </Text>
      </View>
      {applications.length === 0 ? (
        <View style={rq.empty}>
          <Icon name="empty" size={48} color="#888" />
          <Text style={rq.emptyTitle}>Заявок пока нет</Text>
          <Text style={rq.emptyText}>Найдите автосервис и запишитесь на приём</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {active.length > 0 && (
            <>
              <Text style={rq.sectionTitle}>Активные · {active.length}</Text>
              {[...active].reverse().map((app: any, i: number) => <AppCard key={i} app={app} />)}
            </>
          )}
          {done.length > 0 && (
            <>
              <TouchableOpacity style={rq.historyToggle} onPress={() => setShowDone(!showDone)}>
                <Icon name="history" size={14} color="#888" />
                <Text style={rq.historyToggleText}>{showDone ? "▾" : "▸"} История · {done.length}</Text>
              </TouchableOpacity>
              {showDone && [...done].reverse().map((app: any, i: number) => <AppCard key={i} app={app} />)}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const ServiceRequestsScreen = ({ navigation, onUnreadChange }: any) => {
  const dispatch = useAppDispatch();
  const service = useAppSelector((state: any) => state.registrationUser.service);
  const [declarations, setDeclarations] = React.useState<any[]>(service?.declaration || []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [showDone, setShowDone] = React.useState(false);
  const [unreadMap, setUnreadMap] = React.useState<Record<string, number>>({});
  const [lastSeenCount, setLastSeenCount] = React.useState<number>(0);
  const [newDeclIds, setNewDeclIds] = React.useState<Set<string>>(new Set());

  const loadFresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/service/getServiceById`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service._id }),
      });
      const data = await res.json();
      if (res.ok && data.service) {
        const newDecls: any[] = data.service.declaration || [];
        if (lastSeenCount > 0) {
          const prevIds = new Set(declarations.map((d: any) => d._id));
          const freshIds = new Set(newDecls.filter((d: any) => !prevIds.has(d._id) && d.status !== "done").map((d: any) => d._id));
          setNewDeclIds(freshIds);
        }
        setLastSeenCount(newDecls.length);
        dispatch(setServiceData(data.service));
        setDeclarations(newDecls);
      }
    } catch (e) { setDeclarations(service?.declaration || []); }
    finally { setIsLoading(false); }
  };

  const fetchUnread = React.useCallback(async () => {
    const activeDecls = declarations.filter((d: any) => d.status !== "done");
    const ids = activeDecls.map((d: any) => d._id).filter(Boolean);
    if (!ids.length || !service?.login) return;
    try {
      const res = await fetch(`${baseUrl}/chat/unread`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds: ids, myLogin: service.login }),
      });
      const data = await res.json();
      if (res.ok) {
        setUnreadMap(data.unread || {});
        const totalMsgs = Object.values(data.unread || {}).reduce((s: any, v: any) => s + v, 0) as number;
        const totalNew = newDeclIds.size;
        onUnreadChange?.(totalMsgs + totalNew);
      }
    } catch {}
  }, [declarations, service?.login, newDeclIds]);

  React.useEffect(() => { loadFresh(); }, []);
  React.useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [fetchUnread]);
  React.useEffect(() => {
    const interval = setInterval(loadFresh, 15000);
    return () => clearInterval(interval);
  }, []);

  const markDone = async (declarationId: string, userLogin: string) => {
    Alert.alert("Подтверждение", "Отметить заявку как выполненную?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Выполнено", onPress: async () => {
          setUpdatingId(declarationId);
          try {
            const res = await fetch(`${baseUrl}/service/updateDeclarationStatus`, {
              method: "PUT", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ serviceId: service._id, declarationId, status: "done" }),
            });
            const data = await res.json();
            if (res.ok && data.service) {
              dispatch(setServiceData(data.service));
              setDeclarations(data.service.declaration || []);
              setNewDeclIds(prev => { const n = new Set(prev); n.delete(declarationId); return n; });
              await fetch(`${baseUrl}/user/updateApplicationStatus`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: userLogin, declarationId, status: "done" }),
              });
            } else Alert.alert("Ошибка", data.message || "Не удалось обновить статус");
          } catch (e) { Alert.alert("Ошибка", "Не удалось обновить статус"); }
          finally { setUpdatingId(null); }
        }
      }
    ]);
  };

  const active = declarations.filter((d: any) => d.status !== "done");
  const done = declarations.filter((d: any) => d.status === "done");

  const DeclCard = ({ decl }: any) => {
  const isDone = decl.status === "done";
  const isNew = newDeclIds.has(decl._id);
  const unread = unreadMap[decl._id] || 0;

  const hasCarInfo = decl.carInfo && (
    decl.carInfo.carBrand || decl.carInfo.carModel || decl.carInfo.carYear ||
    decl.carInfo.carNumber || decl.carInfo.vinNumber || decl.carInfo.phone
  );

  return (
    <View style={[rq.card, isDone && { opacity: 0.6 }, isNew && rq.cardNew]}>
      {isNew && (
        <View style={rq.newBanner}>
          <Icon name="warning" size={12} color="#FFC107" />
          <Text style={rq.newBannerText}> Новая заявка</Text>
        </View>
      )}
      <View style={rq.cardHeader}>
        <View style={[rq.avatar, { backgroundColor: "#3a7bd5" }]}>
          <Text style={rq.avatarText}>{decl.login?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={rq.clientName}>{decl.carInfo?.displayName || decl.login}</Text>
          <Text style={rq.dateText}>
            <Icon name="calendar" size={12} color="#888" /> {formatDate(decl.date)} в {decl.time}
          </Text>
        </View>
        <View style={[rq.statusBadge, isDone ? rq.statusBadgeDone : rq.statusBadgeNew]}>
          {isDone ? <Icon name="check" size={12} color="#666" /> : <Icon name="circle-dot" size={12} color="#4caf50" />}
          <Text style={[rq.statusText, isDone ? rq.statusTextDone : rq.statusTextNew]}>
            {isDone ? " Выполнена" : " Активна"}
          </Text>
        </View>
      </View>

      {decl.listAssistances?.length > 0 && (
        <View style={rq.tagsRow}>
          {decl.listAssistances.map((sv: string, j: number) => (
            <View key={j} style={rq.tag}><Text style={rq.tagText}>{sv}</Text></View>
          ))}
        </View>
      )}

      {hasCarInfo && (
        <View style={rq.carInfoBox}>
          <View style={rq.carInfoTitleRow}>
            <Icon name="car" size={14} color="#FFC107" />
            <Text style={rq.carInfoTitle}> Автомобиль клиента</Text>
          </View>
          {decl.carInfo.phone && (
            <View style={rq.carInfoRow}>
              <Icon name="phone" size={12} color="#888" />
              <Text style={rq.carInfoText}> {decl.carInfo.phone}</Text>
            </View>
          )}
          {(decl.carInfo.carBrand || decl.carInfo.carModel) && (
            <View style={rq.carInfoRow}>
              <Icon name="car" size={12} color="#888" />
              <Text style={rq.carInfoText}>
                {decl.carInfo.carBrand} {decl.carInfo.carModel} {decl.carInfo.carYear ? `(${decl.carInfo.carYear})` : ''}
              </Text>
            </View>
          )}
          {decl.carInfo.carNumber && (
            <View style={rq.carInfoRow}>
              <Icon name="pin" size={12} color="#888" />
              <Text style={rq.carInfoText}> {decl.carInfo.carNumber}</Text>
            </View>
          )}
          {decl.carInfo.vinNumber && (
            <View style={rq.carInfoRow}>
              <Icon name="clipboard" size={12} color="#888" />
              <Text style={rq.carInfoText}> {decl.carInfo.vinNumber}</Text>
            </View>
          )}
        </View>
      )}

      <View style={rq.cardActions}>
        <TouchableOpacity
          style={[rq.chatBtn, unread > 0 && rq.chatBtnUnread]}
          onPress={() => {
            setUnreadMap(prev => { const n = {...prev}; delete n[decl._id]; return n; });
            setNewDeclIds(prev => { const n = new Set(prev); n.delete(decl._id); return n; });
            navigation.navigate("Chat", { applicationId: decl._id, serviceName: service.nameService, interlocutorLogin: decl.login });
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="chat" size={16} color={unread > 0 ? "#fff" : "#3a7bd5"} />
            <Text style={[rq.chatBtnText, unread > 0 && { color: "#fff" }]}>Ответить клиенту</Text>
            {unread > 0 && <Badge count={unread} />}
          </View>
        </TouchableOpacity>
        {!isDone && (
          <TouchableOpacity style={rq.doneBtn} onPress={() => markDone(decl._id, decl.login)} disabled={updatingId === decl._id}>
            {updatingId === decl._id ? <ActivityIndicator color="#1d1d1d" size="small" /> : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Icon name="check" size={14} color="#1d1d1d" />
                <Text style={rq.doneBtnText}>Выполнено</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

  return (
    <View style={{ flex: 1, backgroundColor: "#1d1d1d" }}>
      <View style={rq.header}>
        <Text style={rq.headerTitle}>
          <Icon name="clipboard" size={20} color="#fff" /> Заявки
        </Text>
        <TouchableOpacity onPress={loadFresh} style={rq.refreshBtn} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color="#FFC107" /> : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="refresh" size={14} color="#FFC107" />
              <Text style={rq.refreshText}>Обновить</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {declarations.length === 0 ? (
        <View style={rq.empty}>
          <Icon name="empty" size={48} color="#888" />
          <Text style={rq.emptyTitle}>Заявок пока нет</Text>
          <Text style={rq.emptyText}>Когда клиенты запишутся — они появятся здесь</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {active.length > 0 && (
            <>
              <Text style={rq.sectionTitle}>Новые · {active.length}</Text>
              {[...active].reverse().map((decl: any, i: number) => <DeclCard key={i} decl={decl} />)}
            </>
          )}
          {done.length > 0 && (
            <>
              <TouchableOpacity style={rq.historyToggle} onPress={() => setShowDone(!showDone)}>
                <Icon name="history" size={14} color="#888" />
                <Text style={rq.historyToggleText}>{showDone ? "▾" : "▸"} Выполненные · {done.length}</Text>
              </TouchableOpacity>
              {showDone && [...done].reverse().map((decl: any, i: number) => <DeclCard key={i} decl={decl} />)}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const rq = StyleSheet.create({
  header: { flexDirection:"row", alignItems:"center", paddingTop:56, paddingHorizontal:20, paddingBottom:16, backgroundColor:"#242424", borderBottomWidth:1, borderBottomColor:"#333" },
  headerTitle: { fontSize:22, fontWeight:"bold", color:"#fff", flex:1 },
  refreshBtn: { backgroundColor:"#2a2a2a", borderRadius:10, paddingHorizontal:14, paddingVertical:8, borderWidth:1, borderColor:"#FFC107" },
  refreshText: { color:"#FFC107", fontSize:14, fontWeight:"600" },
  empty: { flex:1, justifyContent:"center", alignItems:"center", padding:32 },
  emptyTitle: { fontSize:18, color:"#fff", fontWeight:"bold", marginBottom:8 },
  emptyText: { color:"#888", textAlign:"center", lineHeight:22 },
  sectionTitle: { fontSize:13, fontWeight:"bold", color:"#FFC107", marginBottom:12, textTransform:"uppercase", letterSpacing:1 },
  historyToggle: { flexDirection:"row", alignItems:"center", paddingVertical:12, marginBottom:8, gap:6 },
  historyToggleText: { color:"#888", fontSize:15, fontWeight:"600" },
  card: { backgroundColor:"#2a2a2a", borderRadius:16, padding:16, marginBottom:12 },
  cardNew: { borderWidth:1, borderColor:"#FFC107" },
  newBanner: { flexDirection:"row", alignItems:"center", backgroundColor:"#3a2e00", borderRadius:8, paddingHorizontal:10, paddingVertical:4, marginBottom:10, alignSelf:"flex-start", gap:6 },
  newBannerText: { color:"#FFC107", fontSize:12, fontWeight:"bold" },
  cardHeader: { flexDirection:"row", alignItems:"center", marginBottom:10 },
  avatar: { width:44, height:44, borderRadius:22, justifyContent:"center", alignItems:"center", marginRight:12 },
  avatarText: { fontSize:18, fontWeight:"bold", color:"#fff" },
  clientName: { fontSize:16, fontWeight:"bold", color:"#fff" },
  dateText: { fontSize:13, color:"#888", marginTop:2, flexDirection:"row", alignItems:"center" },
  statusBadge: { flexDirection:"row", alignItems:"center", borderRadius:10, paddingHorizontal:8, paddingVertical:4, borderWidth:1, gap:4 },
  statusBadgeNew: { backgroundColor:"#1a3a1a", borderColor:"#4caf50" },
  statusBadgeDone: { backgroundColor:"#2a2a2a", borderColor:"#555" },
  statusText: { fontSize:12, fontWeight:"600" },
  statusTextNew: { color:"#4caf50" },
  statusTextDone: { color:"#666" },
  tagsRow: { flexDirection:"row", flexWrap:"wrap", gap:6, marginBottom:10 },
  tag: { backgroundColor:"#333", borderRadius:16, paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:"#444" },
  tagText: { color:"#aaa", fontSize:12 },
  cardActions: { flexDirection:"row", gap:8, marginTop:4 },
  chatBtn: { flex:1, backgroundColor:"#2a2a2a", borderRadius:12, padding:10, alignItems:"center", borderWidth:1, borderColor:"#3a7bd5" },
  chatBtnUnread: { backgroundColor:"#3a7bd5", borderColor:"#3a7bd5" },
  chatBtnText: { color:"#3a7bd5", fontWeight:"bold", fontSize:13 },
  doneBtn: { flex:1, backgroundColor:"#FFC107", borderRadius:12, padding:10, alignItems:"center" },
  doneBtnText: { color:"#1d1d1d", fontWeight:"bold", fontSize:14 },
  cancelBtn: { flex:1, backgroundColor:"#2a2a2a", borderRadius:12, padding:10, alignItems:"center", borderWidth:1, borderColor:"#ff4444" },
  cancelBtnText: { color:"#ff4444", fontWeight:"bold", fontSize:13 },
  carInfoBox: {
  backgroundColor: "#222",
  borderRadius: 12,
  padding: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#333",
},
carInfoTitleRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},
carInfoTitle: {
  color: "#FFC107",
  fontSize: 11,
  fontWeight: "bold",
  textTransform: "uppercase",
  marginLeft: 4,
},
carInfoRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
},
carInfoText: {
  color: "#fff",
  fontSize: 13,
  marginLeft: 8,
},
});


const MainScreen = ({ navigation }: any) => {
  const serviceData = useAppSelector((state: any) => state.registrationUser.service);
  const userData = useAppSelector((state: any) => state.registrationUser.user);
  const isService = !!serviceData;
  const [activeTab, setActiveTab] = React.useState(isService ? "Profile" : "Services");
  const [requestsBadge, setRequestsBadge] = React.useState(0);

  const userTabs = [
    { name:"Services", label:"Услуги", isService: false },
    { name:"Requests", label:"Заявки", isService: false },
    { name:"Profile", label:"Профиль", isService: false },
  ];
  const serviceTabs = [
    { name:"Profile", label:"Мой сервис", isService: true },
    { name:"Requests", label:"Заявки", isService: true },
  ];

  const fetchGlobalUnread = React.useCallback(async () => {
    try {
      if (isService && serviceData) {
        const activeDecls = (serviceData.declaration || []).filter((d: any) => d.status !== "done");
        const ids = activeDecls.map((d: any) => d._id).filter(Boolean);
        if (!ids.length) { setRequestsBadge(0); return; }
        const res = await fetch(`${baseUrl}/chat/unread`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationIds: ids, myLogin: serviceData.login }),
        });
        const data = await res.json();
        if (res.ok) {
          const total = Object.values(data.unread || {}).reduce((s: any, v: any) => s + v, 0) as number;
          setRequestsBadge(total);
        }
      } else if (userData) {
        const activeApps = (userData.myApplications || []).filter((a: any) => a.status !== "done");
        const ids = activeApps.map((a: any) => a.declarationId || a._id).filter(Boolean);
        if (!ids.length) { setRequestsBadge(0); return; }
        const res = await fetch(`${baseUrl}/chat/unread`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationIds: ids, myLogin: userData.login }),
        });
        const data = await res.json();
        if (res.ok) {
          const total = Object.values(data.unread || {}).reduce((s: any, v: any) => s + v, 0) as number;
          setRequestsBadge(total);
        }
      }
    } catch {}
  }, [isService, serviceData, userData]);

  React.useEffect(() => {
    fetchGlobalUnread();
    const interval = setInterval(fetchGlobalUnread, 10000);
    return () => clearInterval(interval);
  }, [fetchGlobalUnread]);

  const handleTabChange = (tab: string) => setActiveTab(tab);
  const badges = { Requests: requestsBadge };

  return (
    <View style={{ flex:1, backgroundColor:"#1d1d1d" }}>
      <View style={{ flex:1 }}>
        {isService ? (
          <>
            {activeTab === "Profile" && <Profile navigation={navigation} />}
            {activeTab === "Requests" && <ServiceRequestsScreen navigation={navigation} onUnreadChange={setRequestsBadge} />}
          </>
        ) : (
          <>
            {activeTab === "Services" && <Services navigation={navigation} />}
            {activeTab === "Requests" && <UserRequestsScreen navigation={navigation} onUnreadChange={setRequestsBadge} />}
            {activeTab === "Profile" && <Profile navigation={navigation} />}
          </>
        )}
      </View>
      <TabBar
        tabs={isService ? serviceTabs : userTabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        accentColor="#FFC107"
        badges={badges}
      />
    </View>
  );
};

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Auth" component={Auth} options={{ headerShown:false }} />
      <Stack.Screen name="Main" component={MainScreen} options={{ headerShown:false }} />
      <Stack.Screen name="Registration" component={Registration} options={{ headerShown:false }} />
      <Stack.Screen name="SearchResults" component={SearchResults} options={{ headerShown:false }} />
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown:false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const tb = StyleSheet.create({
  container: { flexDirection:"row", backgroundColor:"#242424", borderTopWidth:1, borderTopColor:"#333", paddingBottom:20, paddingTop:10 },
  tab: { flex:1, alignItems:"center", justifyContent:"center" },
  label: { fontSize:11, color:"#666", marginTop:3 },
  dot: { position:"absolute", bottom:-6, width:4, height:4, borderRadius:2 },
});