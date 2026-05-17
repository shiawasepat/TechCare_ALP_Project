import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "@/components/BottomNavigation";

export default function ChatScreen() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
			<View style={[styles.header, { paddingTop: insets.top + 12 }]}>
				<Pressable style={styles.backButton} onPress={() => router.back()}>
					<Feather name="arrow-left" size={22} color="#111827" />
				</Pressable>
				<Text style={styles.title}>Chat</Text>
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.emptyCard}>
					<View style={styles.emptyIconWrap}>
						<MaterialCommunityIcons name="chat-outline" size={34} color="#2D6BFF" />
					</View>
					<Text style={styles.emptyTitle}>Belum ada percakapan</Text>
					<Text style={styles.emptyText}>Riwayat chat dengan service center akan muncul di sini.</Text>
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
		fontWeight: "800",
		color: "#111827",
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 14,
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
		fontWeight: "800",
		color: "#111827",
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: "center",
		color: "#4B5563",
	},
});