import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButtonHeader from "@/components/BackButtonHeader";
import { fetchHistoryItems, findHistoryItemById, historyItems as fallbackHistoryItems, HistoryItem } from "../historyData";

const getStatusPalette = (status: string) => {
	const normalizedStatus = status.toLowerCase();

	if (normalizedStatus.includes("cancel")) {
		return { backgroundColor: "#FEE2E2", textColor: "#DC2626" };
	}

	if (normalizedStatus.includes("complete")) {
		return { backgroundColor: "#DCFCE7", textColor: "#16A34A" };
	}

	if (normalizedStatus.includes("progress") || normalizedStatus.includes("waiting")) {
		return { backgroundColor: "#E0EBFF", textColor: "#2D6BFF" };
	}

	return { backgroundColor: "#EEF2FF", textColor: "#4F46E5" };
};

export default function HistoryDetailScreen() {
	const router = useRouter();
	const params = useLocalSearchParams<{ id?: string }>();
	const historyId = typeof params.id === "string" ? params.id : undefined;
	const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		const loadHistoryItem = async () => {
			setIsLoading(true);
			setErrorMessage(null);

			try {
				const result = await fetchHistoryItems();
				const resolvedItem = findHistoryItemById(result.items, historyId) ?? findHistoryItemById(fallbackHistoryItems, historyId) ?? null;

				if (!isActive) {
					return;
				}

				if (!resolvedItem) {
					setHistoryItem(null);
					setErrorMessage("History item not found.");
					return;
				}

				setHistoryItem(resolvedItem);
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		};

		void loadHistoryItem();

		return () => {
			isActive = false;
		};
	}, [historyId]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
				<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
				<BackButtonHeader title="History Detail" subtitle="Loading..." onBack={() => router.back()} />

				<View style={styles.stateCard}>
					<ActivityIndicator color="#2D6BFF" />
					<Text style={styles.stateText}>Loading history details...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!historyItem) {
		return (
			<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
				<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
				<BackButtonHeader title="History Detail" subtitle="Not found" onBack={() => router.back()} />

				<View style={styles.stateCard}>
					<Text style={styles.stateText}>{errorMessage || "History item not found."}</Text>
					<Pressable style={styles.stateButton} onPress={() => router.back()}>
						<Text style={styles.stateButtonText}>Go Back</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	const statusPalette = getStatusPalette(historyItem.status);

	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
			<BackButtonHeader title="History Detail" subtitle={historyItem.title} onBack={() => router.back()} />

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.summaryCard}>
					<View style={styles.summaryTopRow}>
						<View style={styles.summaryIconWrap}>
							<Feather name="clipboard" size={20} color="#2D6BFF" />
						</View>
						<View style={styles.summaryTextWrap}>
							<Text style={styles.serviceTitle}>{historyItem.title}</Text>
							<Text style={styles.serviceSubtitle}>{historyItem.serviceType}</Text>
						</View>
						<View style={[styles.statusPill, { backgroundColor: statusPalette.backgroundColor }]}>
							<Text style={[styles.statusPillText, { color: statusPalette.textColor }]}>{historyItem.status}</Text>
						</View>
					</View>

					<View style={styles.summaryGrid}>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Price</Text>
							<Text style={styles.infoValue}>{historyItem.price}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Date</Text>
							<Text style={styles.infoValue}>{historyItem.date}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Technician</Text>
							<Text style={styles.infoValue}>{historyItem.technician}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>Payment</Text>
							<Text style={styles.infoValue}>{historyItem.paymentMethod}</Text>
						</View>
					</View>
				</View>

				<View style={styles.sectionCard}>
					<Text style={styles.sectionTitle}>Service details</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Type</Text>
						<Text style={styles.detailValue}>{historyItem.serviceType}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Location</Text>
						<Text style={styles.detailValue}>{historyItem.address}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Status</Text>
						<Text style={styles.detailValue}>{historyItem.status}</Text>
					</View>
				</View>

				<View style={styles.sectionCard}>
					<Text style={styles.sectionTitle}>What was done</Text>
					{historyItem.steps.map((step) => (
						<View key={step} style={styles.stepRow}>
							<View style={styles.stepDot} />
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}
				</View>

				<View style={styles.sectionCard}>
					<Text style={styles.sectionTitle}>Notes</Text>
					<Text style={styles.notesText}>{historyItem.notes}</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#F6F9FF",
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 14,
		paddingBottom: 28,
		gap: 14,
	},
	stateCard: {
		marginTop: 14,
		marginHorizontal: 20,
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		shadowColor: "#D8E1EF",
		shadowOpacity: 0.18,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 1,
	},
	stateText: {
		fontSize: 13.5,
		color: "#374151",
		fontWeight: "600",
		textAlign: "center",
	},
	stateButton: {
		backgroundColor: "#2D6BFF",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 999,
	},
	stateButtonText: {
		fontSize: 13,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	summaryCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		padding: 16,
		shadowColor: "#D8E1EF",
		shadowOpacity: 0.22,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 6 },
		elevation: 2,
	},
	summaryTopRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 14,
	},
	summaryIconWrap: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#EEF4FF",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	summaryTextWrap: {
		flex: 1,
	},
	serviceTitle: {
		fontSize: 16,
		fontWeight: "800",
		color: "#111827",
		marginBottom: 4,
	},
	serviceSubtitle: {
		fontSize: 13,
		color: "#4B5563",
	},
	statusPill: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "#EFF6FF",
	},
	statusPillText: {
		fontSize: 11,
		fontWeight: "800",
		color: "#2D6BFF",
	},
	summaryGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	infoItem: {
		width: "48%",
		backgroundColor: "#F8FAFF",
		borderRadius: 16,
		padding: 12,
	},
	infoLabel: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 6,
	},
	infoValue: {
		fontSize: 13,
		fontWeight: "800",
		color: "#111827",
	},
	sectionCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		padding: 16,
		shadowColor: "#D8E1EF",
		shadowOpacity: 0.18,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 1,
	},
	sectionTitle: {
		fontSize: 15.5,
		fontWeight: "800",
		color: "#111827",
		marginBottom: 12,
	},
	detailRow: {
		marginBottom: 10,
	},
	detailLabel: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 4,
	},
	detailValue: {
		fontSize: 13.5,
		color: "#111827",
		fontWeight: "600",
	},
	stepRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	stepDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#2D6BFF",
		marginRight: 10,
	},
	stepText: {
		fontSize: 13.5,
		color: "#374151",
		fontWeight: "500",
	},
	notesText: {
		fontSize: 13.5,
		color: "#374151",
		lineHeight: 20,
	},
});