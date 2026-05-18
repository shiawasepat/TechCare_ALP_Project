import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import BackButtonHeader from "@/components/BackButtonHeader";
import { colors } from "@/styles/colors";
import { useState } from "react";

interface Chat {
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  timestamp: string;
}

interface Message {
  id: string;
  text: string;
  sender: "mitra" | "customer";
  timestamp: string;
}

export default function MitraChatScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Messages mapped by chat ID
  const chatMessages: Record<string, Message[]> = {
    "1": [
      { id: "1", text: "Hi, I need help with my computer", sender: "customer", timestamp: "10:30 AM" },
      { id: "2", text: "Sure! What's the issue?", sender: "mitra", timestamp: "10:31 AM" },
      { id: "3", text: "The thermal paste on the CPU seems dried out", sender: "customer", timestamp: "10:32 AM" },
      { id: "4", text: "I can help with that. When can you bring it in?", sender: "mitra", timestamp: "10:33 AM" },
      { id: "5", text: "How about tomorrow at 2 PM?", sender: "customer", timestamp: "10:34 AM" },
      { id: "6", text: "Perfect! See you then.", sender: "mitra", timestamp: "10:35 AM" },
    ],
    "2": [
      { id: "1", text: "Your computer repair is complete!", sender: "mitra", timestamp: "2:15 PM" },
      { id: "2", text: "Great! How much do I owe you?", sender: "customer", timestamp: "2:16 PM" },
      { id: "3", text: "The total is Rp 450,000. Payment methods available at pickup.", sender: "mitra", timestamp: "2:17 PM" },
      { id: "4", text: "Perfect, I'll pick it up tomorrow", sender: "customer", timestamp: "2:18 PM" },
      { id: "5", text: "Thanks for the quick service!", sender: "customer", timestamp: "2:19 PM" },
    ],
    "3": [
      { id: "1", text: "Hi, I'd like to schedule a service", sender: "customer", timestamp: "9:00 AM" },
      { id: "2", text: "Sure! What type of service do you need?", sender: "mitra", timestamp: "9:05 AM" },
      { id: "3", text: "Engine cleaning and optimization", sender: "customer", timestamp: "9:06 AM" },
      { id: "4", text: "We have availability on Friday at 10 AM", sender: "mitra", timestamp: "9:07 AM" },
      { id: "5", text: "That works for me! Please confirm the booking", sender: "customer", timestamp: "9:08 AM" },
      { id: "6", text: "Booking confirmed! See you Friday.", sender: "mitra", timestamp: "9:09 AM" },
    ],
  };

  const chatItems: Chat[] = [
    { id: "1", title: "Laury", subtitle: "Perfect! See you then.", timestamp: "10:30 AM" },
    { id: "2", title: "Dewa", subtitle: "Thanks for the quick service!", timestamp: "10:35 AM" },
    { id: "3", title: "Rakha", subtitle: "Booking confirmed! See you Friday.", timestamp: "10:40 AM" },
  ];

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Load messages for this chat
    setMessages(chatMessages[chat.id] || []);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          sender: "mitra",
          text: messageInput,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessageInput("");
    }
  };

  // Chat List View
  if (!selectedChat) {
    return (
      <View style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
        <View style={styles.header}>
          <Text style={styles.title}>Chat</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.chatItems}>
            {chatItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.chatItem} onPress={() => handleSelectChat(item)}>
                  <View style={styles.chatAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chatTitle}>{item.title}</Text>
                    <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.chatTime}>{item.timestamp}</Text>
                </TouchableOpacity>
                {index < chatItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
            {chatItems.length === 0 && (
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="chat-outline" size={34} color="#2D6BFF" />
              </View>
            )}
            {chatItems.length === 0 && <Text style={styles.emptyTitle}>No Messages Yet</Text>}
            {chatItems.length === 0 && <Text style={styles.emptyText}>History chat with customer will appear here.</Text>}
          </View>
        </ScrollView>

        <MitraBottomNavigation />
      </View>
    );
  }

  // Chat Detail View
  return (
    <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />

        <BackButtonHeader title={selectedChat.title} subtitle="Online" onBack={() => setSelectedChat(null)} />

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageBubble, msg.sender === "mitra" ? styles.mitraMessage : styles.customerMessage]}>
              <Text style={[styles.messageText, msg.sender === "mitra" && styles.mitraMessageText]}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.addAttachmentButton}>
            <Feather name="paperclip" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TextInput style={styles.messageInput} placeholder="Type a message..." placeholderTextColor="#9CA3AF" value={messageInput} onChangeText={setMessageInput} />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
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
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#4B5563",
  },
  chatItems: {
    gap: 0,
  },
  chatItem: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 16,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#9495a1",
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#b4b8bf",
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  chatTime: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
    marginLeft: "auto",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    marginBottom: 12,
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  customerMessage: {
    backgroundColor: "#e6e6e6",
    alignSelf: "flex-start",
  },
  mitraMessage: {
    backgroundColor: colors.primary.backgroundColor,
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 14,
    color: "#111827",
  },
  mitraMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  addAttachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e6e6e6",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#e6e6e6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: colors.primary.backgroundColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
