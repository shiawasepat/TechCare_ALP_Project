import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import storeImages from "../storeImages";
import BackButtonHeader from "@/components/BackButtonHeader";
import { useEffect, useState, useRef } from "react";

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

const initialMessages: Message[] = [
  { id: "2", text: "What took you guys so long? I dont see the technician moving at all.", role: "user", time: "08:46", seen: false },
  { id: "1", text: "Sorry— our technician delayed by traffic", role: "agent", time: "08:44" },
];

export default function ChatConversation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const name = typeof params.name === "string" && params.name.length > 0 ? params.name : "Service Center";
  const insets = useSafeAreaInsets();
  const avatarSource = (() => {
    const key = Object.keys(storeImages).find((k) => k.toLowerCase().includes(String(name).toLowerCase()));
    return (storeImages as any)[name] || (key ? (storeImages as any)[key] : undefined) || require("../../../../assets/Google.jpg");
  })();
  const [messages, setMessages] = useState<ConversationEntry[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(true);
  const [isSeen, setIsSeen] = useState(false);
  const listRef = useRef<FlatList>(null);

  const quickReplies = ["I'll wait", "How long will it take?", "No problem"];

  const formatNow = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ConversationEntry = { id: Date.now().toString(), text: text.trim(), role: "user", time: formatNow(), seen: isSeen };
    setMessages((m) => [...m, msg]);
    setInput("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true } as any), 100);
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

  const markLastUserMessageSeen = () => {
    setMessages((current) => {
      const next = [...current];
      for (let index = next.length - 1; index >= 0; index -= 1) {
        if (next[index].role === "user" && !next[index].deletedMode) {
          next[index] = { ...next[index], seen: true };
          break;
        }
      }
      return next;
    });
    setIsSeen(true);
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

  const renderItem = ({ item }: { item: Message }) => {
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
    markLastUserMessageSeen();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
      <BackButtonHeader title={name} avatarSource={avatarSource} onBack={() => router.push({ pathname: "/user/chat" })} />
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
                <TouchableOpacity key={q} style={styles.quickButton} onPress={() => sendMessage(q)}>
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
              <TextInput placeholder="Type a message" value={input} onChangeText={setInput} style={styles.input} onSubmitEditing={() => sendMessage(input)} />
              <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
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
