import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomNavigation } from "@/components/BottomNavigation";
import BackButtonHeader from "@/components/BackButtonHeader";
import { historyItems } from "./historyData";

export default function HistoryScreen() {
	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
			<BackButtonHeader title="History" />

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				{historyItems.map((item) => (
					<Pressable
						key={item.id}
						style={styles.card}
						onPress={() => router.push({ pathname: "/user/history/[id]", params: { id: item.id } })}
					>
						<View style={styles.iconWrap}>
							<Feather name="clock" size={20} color="#2D6BFF" />
						</View>
						<View style={styles.textWrap}>
							<Text style={styles.itemTitle}>{item.title}</Text>
							<Text style={styles.itemSubtitle}>{item.serviceType}</Text>
						</View>
						<View style={styles.metaWrap}>
							<Text style={styles.priceText}>{item.price}</Text>
							<Text style={styles.timeText}>{item.time}</Text>
						</View>
						<Feather name="chevron-right" size={18} color="#9CA3AF" />
					</Pressable>
				))}
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
		gap: 12,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 20,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#D8E1EF",
		shadowOpacity: 0.22,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 6 },
		elevation: 2,
	},
	iconWrap: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#EEF4FF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	textWrap: {
		flex: 1,
	},
	metaWrap: {
		alignItems: "flex-end",
		marginRight: 8,
	},
	itemTitle: {
		fontSize: 15.5,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 4,
	},
	itemSubtitle: {
		fontSize: 13.5,
		color: "#4B5563",
	},
	priceText: {
		fontSize: 13,
		fontWeight: "800",
		color: "#111827",
		marginBottom: 4,
	},
	timeText: {
		fontSize: 12.5,
		fontWeight: "700",
		color: "#2D6BFF",
	},
});