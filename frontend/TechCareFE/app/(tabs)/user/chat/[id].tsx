import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import storeImages from "../storeImages";
import BackButtonHeader from "@/components/BackButtonHeader";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/api";
import { getEcho } from "@/utils/realtime";

type Message = {
  id: string;
  text: string;
  role: "user" | "agent";
  time: string;
  seen?: boolean;
};

type DeletedMode = "all" | "me";

type ConversationEntry = Message & {
  deletedMode?: DeletedMode;
};

type ConversationPreset = {
  subtitle: string;
  online?: boolean;
  quickReplies: string[];
  initialMessages: Message[];
};

const conversationPresets: Record<string, ConversationPreset> = {
  "Mugen Computer Pettarani": {
    subtitle: "Usually replies in a few minutes",
    online: true,
    quickReplies: ["Please update me", "Is the technician nearby?", "What is the ETA?"],
    initialMessages: [
      { id: "2", text: "The technician is on the way and should arrive soon.", role: "agent", time: "08:44" },
      { id: "1", text: "Thanks, please keep me posted if there is any delay.", role: "user", time: "08:46", seen: false },
    ],
  },
  "Elextra Komputer": {
    subtitle: "Replies during business hours",
    online: true,
    quickReplies: ["Can I reschedule?", "Do you have spare parts?", "Please confirm the booking"],
    initialMessages: [
      { id: "2", text: "Your schedule is confirmed for tomorrow at 10:00 AM.", role: "agent", time: "09:12" },
      { id: "1", text: "Great, I’ll be ready at that time.", role: "user", time: "09:15", seen: true },
    ],
  },
  "HND Computer": {
    subtitle: "Currently handling a new booking",
    online: false,
    quickReplies: ["I need help with pricing", "Can you check availability?", "Please cancel my order"],
    initialMessages: [
      { id: "2", text: "We received your request, but the booking was canceled before confirmation.", role: "agent", time: "07:30" },
      { id: "1", text: "Understood, I’ll create a new booking later.", role: "user", time: "07:33", seen: false },
    ],
  },
};

const defaultPreset: ConversationPreset = {
  subtitle: "Chat with support",
  online: false,
  quickReplies: ["Please update me", "I need help", "Thank you"],
  initialMessages: [
    { id: "2", text: "Hello, how can we help you today?", role: "agent", time: "08:44" },
    { id: "1", text: "I have a question about my service booking.", role: "user", time: "08:46", seen: false },
  ],
};

export default function ChatConversation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const name = typeof params.name === "string" && params.name.length > 0 ? params.name : "Service Center";
  const orderId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const preset = conversationPresets[name] ?? defaultPreset;
  const insets = useSafeAreaInsets();
  const avatarSource = (() => {
    const key = Object.keys(storeImages).find((k) => k.toLowerCase().includes(String(name).toLowerCase()));
    return (storeImages as any)[name] || (key ? (storeImages as any)[key] : undefined) || require("../../../../assets/Google.jpg");
  })();
  const [messages, setMessages] = useState<ConversationEntry[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const listRef = useRef<FlatList>(null);

  const quickReplies = preset.quickReplies;

  const formatNow = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const formatTime = (value?: string) => {
    if (!value) return formatNow();
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return formatNow();
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const toTimestamp = (value?: string) => {
    if (!value) return 0;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  const isUserSender = (senderType?: string) => {
    if (!senderType) return false;
    return senderType.toLowerCase().includes("user");
  };

  const normalizeMessage = (message: any): ConversationEntry => {
    const role: "user" | "agent" = isUserSender(message?.sender_type) ? "user" : "agent";
    return {
      id: String(message?.id_message ?? message?.id ?? Date.now()),
      text: String(message?.pesan ?? message?.text ?? ""),
      role,
      time: formatTime(message?.created_at),
      seen: role === "user" ? true : undefined,
    };
  };

  const appendMessage = (message: ConversationEntry) => {
    setMessages((current) => {
      if (current.some((item) => item.id === message.id)) {
        return current;
      }
      return [...current, message];
    });
  };

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true } as any), 100);
  };

  const getAuthToken = async () => {
    const token = (await AsyncStorage.getItem("authToken"))?.trim();
    if (!token) {
      Alert.alert("Login required", "Please log in again to access chat.");
      return null;
    }
    return token;
  };

  const loadChat = async () => {
    if (!orderId) {
      return;
    }
    if (!API_BASE_URL) {
      Alert.alert("Missing API base URL", "Set EXPO_PUBLIC_API_BASE_URL in your environment.");
      return;
    }
    const token = await getAuthToken();
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to load chat (${response.status})`);
      }
      const payload = await response.json();
      const chat = payload?.chat;
      if (chat?.id_chats) {
        setChatId(chat.id_chats);
      }
      const rawMessages = Array.isArray(chat?.messages) ? chat.messages : [];
      const sorted = [...rawMessages].sort((a, b) => toTimestamp(a?.created_at) - toTimestamp(b?.created_at));
      setMessages(sorted.map(normalizeMessage));
    } catch (error) {
      Alert.alert("Unable to load chat", "Please try again later.");
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !orderId) return;
    if (!API_BASE_URL) {
      Alert.alert("Missing API base URL", "Set EXPO_PUBLIC_API_BASE_URL in your environment.");
      return;
    }
    const token = await getAuthToken();
    if (!token) return;
    const echo = await getEcho();
    const socketId = typeof echo?.socketId === "function" ? echo.socketId() : undefined;

    const tempId = `temp-${Date.now()}`;
    const localMessage: ConversationEntry = {
      id: tempId,
      text: trimmed,
      role: "user",
      time: formatNow(),
      seen: true,
    };

    setInput("");
    appendMessage(localMessage);
    scrollToEnd();

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(socketId ? { "X-Socket-ID": socketId } : {}),
        },
        body: JSON.stringify({ pesan: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message (${response.status})`);
      }

      const payload = await response.json();
      const serverMessage = normalizeMessage(payload?.data ?? payload);
      if (payload?.data?.id_chats && !chatId) {
        setChatId(payload.data.id_chats);
      }
      setMessages((current) => {
        const restoredMessage: ConversationEntry = {
          ...serverMessage,
          role: "user",
          seen: true,
        };

        const updated = current.map((message) =>
          message.id === tempId ? restoredMessage : message
        );
        const seen = new Set<string>();
        return updated.filter((message) => {
          if (seen.has(message.id)) return false;
          seen.add(message.id);
          return true;
        });
      });
    } catch (error) {
      setMessages((current) => current.filter((message) => message.id !== tempId));
      Alert.alert("Send failed", "Message could not be sent. Please try again.");
    }
  };

  const [showAddMenu, setShowAddMenu] = useState(false);

  const openAddMenu = () => {
    setShowAddMenu((current) => !current);
  };

  const handleAddFiles = () => {
    setShowAddMenu(false);
    Alert.alert("Upload files", "Function not yet implemented.");
  };

  const handleAddImage = () => {
    setShowAddMenu(false);
    Alert.alert("Upload image", "Function not yet implemented.");
  };

  const deleteMessage = (messageId: string, mode: DeletedMode) => {
    setMessages((current) =>
      current
        .map((message): ConversationEntry | null => {
          if (message.id !== messageId) return message;
          if (mode === "all") {
            return null;
          }
          return { ...message, deletedMode: "me" };
        })
        .filter((message): message is ConversationEntry => message !== null)
    );
  };

  const openDeleteMenu = (message: ConversationEntry) => {
    const options = message.role === "user" ? ["Delete for everyone", "Delete for me", "Cancel"] : ["Delete for me", "Cancel"];
    Alert.alert("Delete message", "Choose how you want to delete this message.", [
      ...options.map((option) => {
        if (option === "Delete for everyone") {
          return { text: option, style: "destructive" as const, onPress: () => deleteMessage(message.id, "all") };
        }
        if (option === "Delete for me") {
          return { text: option, style: "destructive" as const, onPress: () => deleteMessage(message.id, "me") };
        }
        return { text: option, style: "cancel" as const };
      }),
    ]);
  };

  const renderItem = ({ item }: { item: ConversationEntry }) => {
    const isUser = item.role === "user";
    const seen = isUser ? Boolean(item.seen) : false;
    const deletedForMe = (item as ConversationEntry).deletedMode === "me";
    return (
      <Pressable onLongPress={() => openDeleteMenu(item as ConversationEntry)} style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAgent]}>
        <View style={[styles.msgBubble, isUser ? styles.msgBubbleUser : styles.msgBubbleAgent]}>
          {deletedForMe ? (
            <Text style={[styles.msgText, styles.deletedText]}>You deleted this message</Text>
          ) : (
            <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextAgent]}>{item.text}</Text>
          )}
          <View style={[styles.metaRow, isUser ? styles.metaRowUser : styles.metaRowAgent]}>
            <Text style={[styles.timeText, isUser ? styles.timeTextUser : styles.timeTextAgent]}>{item.time}</Text>
            {isUser ? (
              <View style={styles.tickWrap}>
                <MaterialCommunityIcons name={seen ? "check-all" : "check"} size={14} color={seen ? "#BFE0FF" : "#D7E6FF"} />
              </View>
            ) : null}
          </View>
        </View>
        {/* spacer removed so user bubble can align to right */}
      </Pressable>
    );
  };

  useEffect(() => {
    loadChat();
  }, [orderId]);

  useEffect(() => {
    if (!chatId) return;
    let active = true;
    let echo: Awaited<ReturnType<typeof getEcho>> | null = null;

    const connect = async () => {
      const instance = await getEcho();
      if (!instance || !active) return;
      echo = instance;
      const channel = instance.private(`chat.${chatId}`);
      channel.listen("MessageSent", (event: any) => {
        const incoming = event?.message;
        if (!incoming) return;
        appendMessage(normalizeMessage(incoming));
        scrollToEnd();
      });
    };

    connect();

    return () => {
      active = false;
      if (echo) {
        echo.leave(`chat.${chatId}`);
      }
    };
  }, [chatId]);

  useEffect(() => {
    if (messages.length) {
      scrollToEnd();
    }
  }, [messages.length]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
      <BackButtonHeader title={name} online={preset.online} avatarSource={avatarSource} onBack={() => router.push({ pathname: "/user/chat" })} />
      <View style={styles.headerDivider} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
        <View style={[styles.quickContainer, { paddingBottom: insets.bottom || 16 }]}>
          <TouchableOpacity style={styles.quickHeader} onPress={() => setShowQuick((s) => !s)}>
            <MaterialCommunityIcons name="plus-box" size={18} color="#2D6BFF" />
            <Text style={styles.quickHeaderText}>Fast reply</Text>
            <Feather name={showQuick ? "chevron-down" : "chevron-up"} size={16} color="#6B7280" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          {showQuick && (
            <View style={styles.quickList}>
              {quickReplies.map((q) => (
                <TouchableOpacity key={q} style={styles.quickButton} onPress={() => void sendMessage(q)}>
                  <Text style={styles.quickButtonText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputDivider} />
          <View style={styles.inputArea}>
            {showAddMenu && (
              <View style={styles.addPopover}>
                <TouchableOpacity style={styles.addPopoverItem} onPress={handleAddFiles}>
                  <Feather name="file-text" size={16} color="#111827" style={styles.addPopoverIcon} />
                  <Text style={styles.addPopoverText}>Upload files</Text>
                </TouchableOpacity>
                <View style={styles.addPopoverSeparator} />
                <TouchableOpacity style={styles.addPopoverItem} onPress={handleAddImage}>
                  <Feather name="image" size={16} color="#111827" style={styles.addPopoverIcon} />
                  <Text style={styles.addPopoverText}>Upload image</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.addBtn} onPress={openAddMenu}>
                <Feather name="plus" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TextInput placeholder="Type a message" value={input} onChangeText={setInput} style={styles.input} onSubmitEditing={() => void sendMessage(input)} />
              <TouchableOpacity style={styles.sendBtn} onPress={() => void sendMessage(input)}>
                <Feather name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F9FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  headerAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerAvatar: {
    flex: 1,
    backgroundColor: "#D1D5DB",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 2,
  },
  headerDivider: {
    height: 6,
    backgroundColor: "#F1F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E6EA",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
    width: "100%",
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgRowAgent: {
    justifyContent: "flex-start",
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  msgBubble: {
    maxWidth: "78%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  msgBubbleUser: {
    backgroundColor: "#2D6BFF",
    borderBottomRightRadius: 6,
    marginLeft: "auto",
    alignSelf: "flex-end",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  msgBubbleAgent: {
    backgroundColor: "#E6E9EE",
    borderBottomLeftRadius: 6,
    alignSelf: "flex-start",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 18,
  },
  msgTextUser: {
    color: "#FFFFFF",
  },
  msgTextAgent: {
    color: "#111827",
  },
  deletedText: {
    color: "#6B7280",
    fontStyle: "italic",
  },
  metaRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  metaRowUser: {
    justifyContent: "flex-end",
  },
  metaRowAgent: {
    justifyContent: "flex-start",
  },
  timeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  timeTextUser: {
    color: "#D7E6FF",
  },
  timeTextAgent: {
    color: "#9CA3AF",
  },
  tickWrap: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  quickContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 8,
    shadowColor: "#E6EEF9",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    borderTopWidth: 1,
    borderTopColor: "#EEF2FF",
  },

  quickHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  quickHeaderText: {
    color: "#2D6BFF",
    fontWeight: "700",
    marginLeft: 8,
  },
  quickList: {
    flexDirection: "column",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  quickButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  quickButtonText: {
    color: "#111827",
  },

  inputDivider: {
    height: 1,
    backgroundColor: "#E6E9EE",
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  inputArea: {
    position: "relative",
  },
  addPopover: {
    position: "absolute",
    bottom: 54,
    left: 0,
    width: 168,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E8ECF0",
    zIndex: 20,
  },
  addPopoverItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  addPopoverIcon: {
    marginRight: 10,
  },
  addPopoverText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  addPopoverSeparator: {
    height: 1,
    backgroundColor: "#EEF2F7",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2D6BFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
