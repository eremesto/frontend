import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator, Keyboard,
  Platform, Dimensions,
} from "react-native";
import { baseUrl } from "api/baseUrl";
import { useAppSelector } from "redux/store";
import Icon from "components/Icon";

const { width } = Dimensions.get("window");

const Chat = ({ route, navigation }: any) => {
  const { applicationId, serviceName, interlocutorLogin } = route.params;
  const userData = useAppSelector((s: any) => s.registrationUser.user);
  const serviceData = useAppSelector((s: any) => s.registrationUser.service);
  const isService = !!serviceData;
  const myLogin = isService ? serviceData.login : userData?.login;
  const senderType = isService ? "service" : "user";

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = async (login: string) => {
    try {
      const res = await fetch(`${baseUrl}/chat/messages/${applicationId}?login=${encodeURIComponent(login)}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!myLogin) return;
    fetchMessages(myLogin);
    pollingRef.current = setInterval(() => fetchMessages(myLogin), 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [myLogin]);

  useEffect(() => {
    if (messages.length > 0) setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    setIsSending(true);
    const optimistic = {
      _id: Date.now().toString(),
      applicationId, senderLogin: myLogin, senderType, text: text.trim(),
      createdAt: new Date().toISOString(), pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    try {
      const res = await fetch(`${baseUrl}/chat/send`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, senderLogin: myLogin, senderType, text: optimistic.text }),
      });
      const saved = await res.json();
      if (res.ok) setMessages((prev) => prev.map((m) => m._id === optimistic._id ? saved : m));
      else setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    } catch { setMessages((prev) => prev.filter((m) => m._id !== optimistic._id)); }
    finally { setIsSending(false); }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const renderMessage = ({ item }: any) => {
    const isMine = item.senderLogin === myLogin;
    const isRead = isMine && item.readBy?.length > 1;
    return (
      <View style={[st.msgRow, isMine ? st.msgRowRight : st.msgRowLeft]}>
        {!isMine && (
          <View style={st.avatar}>
            <Text style={st.avatarText}>{item.senderLogin?.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={[st.bubble, isMine ? st.bubbleMine : st.bubbleTheirs, item.pending && { opacity: 0.6 }]}>
          {!isMine && <Text style={st.senderName}>{item.senderLogin}</Text>}
          <Text style={[st.msgText, isMine && st.msgTextMine]}>{item.text}</Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 4 }}>
            <Text style={[st.msgTime, isMine && st.msgTimeMine]}>
              {item.pending ? "..." : formatTime(item.createdAt)}
            </Text>
            {isMine && !item.pending && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="check" size={10} color={isRead ? "#8a6500" : "#8a6500"} style={{ opacity: isRead ? 1 : 0.4 }} />
                {isRead && <Icon name="check" size={10} color="#8a6500" style={{ marginLeft: 2 }} />}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={st.screen}>
      <View style={st.container}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon name="back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={st.headerCenter}>
            <View style={st.headerAvatar}>
              <Text style={st.headerAvatarText}>{(serviceName || interlocutorLogin)?.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={st.headerName}>{isService ? interlocutorLogin : serviceName}</Text>
              <Text style={st.headerSub}>Чат по заявке</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={st.centered}><ActivityIndicator color="#FFC107" size="large" /></View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            style={st.messagesList}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            contentContainerStyle={st.messagesContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={st.centered}>
                <Icon name="chat" size={48} color="#888" />
                <Text style={st.emptyText}>Начните общение{"\n"}Напишите первое сообщение</Text>
              </View>
            }
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        <View style={[st.inputRow, keyboardHeight > 0 && { marginBottom: keyboardHeight }]}>
          <TextInput
            style={st.input}
            value={text}
            onChangeText={setText}
            placeholder="Написать сообщение..."
            placeholderTextColor="#555"
            multiline
            maxLength={500}
            onFocus={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 250)}
          />
          <TouchableOpacity
            style={[st.sendBtn, (!text.trim() || isSending) && st.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || isSending}
          >
            <Icon name="send" size={18} color="#1d1d1d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1d1d1d" },
  container: { flex: 1, backgroundColor: "#1d1d1d" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyText: { color: "#888", fontSize: 15, textAlign: "center", lineHeight: 24, marginTop: 12 },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 12 },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: "#242424", borderBottomWidth: 1, borderBottomColor: "#333" },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#333", justifyContent: "center", alignItems: "center", marginRight: 12 },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFC107", justifyContent: "center", alignItems: "center" },
  headerAvatarText: { fontWeight: "bold", color: "#1d1d1d", fontSize: 16 },
  headerName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  headerSub: { fontSize: 12, color: "#888" },
  msgRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  msgRowRight: { justifyContent: "flex-end" },
  msgRowLeft: { justifyContent: "flex-start" },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#3a7bd5", justifyContent: "center", alignItems: "center", marginRight: 8 },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  bubble: { maxWidth: width * 0.7, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: "#FFC107", borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: "#2a2a2a", borderBottomLeftRadius: 4 },
  senderName: { fontSize: 11, color: "#888", marginBottom: 4 },
  msgText: { fontSize: 15, color: "#ffffff" },
  msgTextMine: { color: "#1d1d1d" },
  msgTime: { fontSize: 10, color: "#555", marginTop: 4, textAlign: "right" },
  msgTimeMine: { color: "#8a6500" },
  inputRow: { flexDirection: "row", alignItems: "flex-end", padding: 12, paddingBottom: Platform.OS === "ios" ? 20 : 12, backgroundColor: "#242424", borderTopWidth: 1, borderTopColor: "#333" },
  input: { flex: 1, backgroundColor: "#2a2a2a", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: "#fff", fontSize: 15, maxHeight: 100, borderWidth: 1, borderColor: "#333" },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFC107", justifyContent: "center", alignItems: "center", marginLeft: 8 },
  sendBtnDisabled: { backgroundColor: "#3a3a00", opacity: 0.5 },
});

export default Chat;