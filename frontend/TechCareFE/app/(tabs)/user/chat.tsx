import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButtonHeader from "@/components/BackButtonHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import storeImages from "./storeImages";

type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  date: string;
  avatar: string | number;
};

const chatPreviews: ChatPreview[] = Object.keys(storeImages).map((name, index) => ({
  id: String(index + 1),
  name,
  lastMessage: "Silakan kirim pesan untuk memulai percakapan.",
  date: "Today",
  avatar: storeImages[name],
}));

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButtonHeader title="Chat" />

      <ScrollView style={[styles.container, { paddingBottom: insets.bottom + 96 }]}>
        <Text style={styles.sectionLabel}>Recent chats</Text>

        <View>
          {chatPreviews.map((chat) => (
            <TouchableOpacity key={chat.id} style={styles.chatRow} onPress={() => router.push({ pathname: "/user/chat/[id]", params: { id: chat.id, name: chat.name } })}>
              <Image source={typeof chat.avatar === "string" ? { uri: chat.avatar } : chat.avatar} style={styles.avatar} />
              <View style={styles.chatContent}>
                <View style={styles.chatTopLine}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {chat.name}
                  </Text>
                  <Text style={styles.chatDate}>{chat.date}</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation />
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
    fontWeight: "800",
    color: "#111827",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#EEF4FF",
  },
  chatContent: {
    flex: 1,
  },
  chatTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  chatDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  chatMessage: {
    fontSize: 13,
    color: "#4B5563",
  },
});
