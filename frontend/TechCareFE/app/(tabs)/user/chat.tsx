import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import storeImages from "./storeImages";
import { BottomNavigation } from "@/components/BottomNavigation";
import BackButtonHeader from "@/components/BackButtonHeader";

type ChatPreview = {
	id: string;
	name: string;
	lastMessage: string;
	date: string;
	avatar: string | number;
};

// Build previews from the storeImages mapping so names and avatars stay in sync
const chatPreviews: ChatPreview[] = Object.keys(storeImages).map((name, idx) => ({
	id: String(idx + 1),
	name,
	lastMessage: "Silakan kirim pesan untuk memulai percakapan.",
	date: "Today",
	avatar: storeImages[name],
}));

export default function ChatListScreen() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<BackButtonHeader title="Chat" onBack={() => router.back()} />

			<View style={styles.container}>
				<Text style={styles.sectionLabel}>Recent chats</Text>
				{chatPreviews.map((chat) => (
					<TouchableOpacity
						key={chat.id}
						style={styles.chatRow}
						onPress={() => router.push({ pathname: "/user/chat/[id]", params: { id: chat.id, name: chat.name } })}
					>
						<Image source={typeof chat.avatar === "string" ? { uri: chat.avatar } : chat.avatar} style={styles.avatar} />
						<View style={styles.chatContent}>
							<View style={styles.chatTopLine}>
								<Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
								<Text style={styles.chatDate}>{chat.date}</Text>
							</View>
							<Text style={styles.chatMessage} numberOfLines={1}>{chat.lastMessage}</Text>
						</View>
						<Feather name="chevron-right" size={18} color="#9CA3AF" />
					</TouchableOpacity>
				))}
			</View>

			<BottomNavigation />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: "#F6F9FF" },
	header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 },
	backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
	title: { marginLeft: 14, fontSize: 18, fontWeight: "700", color: "#111827" },
	container: { flex: 1, padding: 20 },
	sectionLabel: { fontSize: 13, fontWeight: "700", color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.6 },
	chatRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: "#D8E1EF", shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
	avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#E5E7EB" },
	chatContent: { flex: 1, marginLeft: 12, marginRight: 10 },
	chatTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
	chatName: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111827", marginRight: 10 },
	chatDate: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
	chatMessage: { fontSize: 13, color: "#6B7280" },
});