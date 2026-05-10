import { useEffect, useMemo, useState, useRef } from "react";
import { Image, ImageSourcePropType, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, PanResponder } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { colors as defaultColor } from "@/styles/colors";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { getCurrentUserLocation } from "@/utils/location";

type FilterKey = "Nearest" | "Top Rated" | "Open Now" | "Filter";

type ServiceCenter = {
	name: string;
	rating: number;
	reviews: number;
	status: string;
	closesAt: string;
	distance: string;
	address: string;
	latitude: number;
	longitude: number;
	image: ImageSourcePropType;
};

type PromoSlide = {
	title: string;
	subtitle: string;
	image: ImageSourcePropType;
	backgroundColor: string;
};

const serviceCenters: ServiceCenter[] = [
	{
		name: "Mugen Computer Pettarani",
		rating: 4.5,
		reviews: 128,
		status: "Open",
		closesAt: "09.00 pm",
		distance: "5.1 km",
		address: "Jl. A. P. Pettarani No.89a",
		latitude: -5.15677,
		longitude: 119.43288,
		image: require("../../../assets/images/sv_ct/Mugen Computer Pettarani.jpg"),
	},
	{
		name: "Mugen Computer Tanjung Bunga",
		rating: 5,
		reviews: 96,
		status: "Open",
		closesAt: "09.00 pm",
		distance: "2.8 km",
		address: "Jl. Metro Tanjung Bunga No.30-31",
		latitude: -5.16844,
		longitude: 119.40462,
		image: require("../../../assets/images/sv_ct/Mugen Computer Tanjung Bunga .jpg"),
	},
	{
		name: "Elextra Komputer",
		rating: 5,
		reviews: 87,
		status: "Open",
		closesAt: "06.00 pm",
		distance: "5.1 km",
		address: "Jl. A.P. Pettarani Ruko Diamond No. 3",
		latitude: -5.15735,
		longitude: 119.43224,
		image: require("../../../assets/images/sv_ct/Elextra Komputer.jpg"),
	},
	{
		name: "HND Computer",
		rating: 5,
		reviews: 143,
		status: "Open",
		closesAt: "09.00 pm",
		distance: "5.1 km",
		address: "Jalan Ince Nurdin No.1AB",
		latitude: -5.15138,
		longitude: 119.42735,
		image: require("../../../assets/images/sv_ct/HND Computer Ince Nurdin.jpg"),
	},
	{
		name: "HND Computer Pengayoman",
		rating: 5,
		reviews: 112,
		status: "Open",
		closesAt: "08.00 pm",
		distance: "5.1 km",
		address: "Jl. Pengayoman No.G 05",
		latitude: -5.14725,
		longitude: 119.45226,
		image: require("../../../assets/images/sv_ct/HND Computer Pengayoman.jpg"),
	},
];

const filters: FilterKey[] = ["Nearest", "Top Rated", "Open Now"];

const promoSlides: PromoSlide[] = [
	{
		title: "20% off for your first service!",
		subtitle: "Get reliable service with great quality.",
		image: require("../../../assets/special_offer.jpg"),
		backgroundColor: "#DDEBFF",
	},
	{
		title: "Free consultation",
		subtitle: "Chat with our team before you book.",
		image: require("../../../assets/special_offer.jpg"),
		backgroundColor: "#EAF4FF",
	},
	{
		title: "Fast repair promo",
		subtitle: "Best prices for screen and battery service.",
		image: require("../../../assets/special_offer.jpg"),
		backgroundColor: "#E5F0FF",
	},
];

export function dashboard() {
	const [activeFilter, setActiveFilter] = useState<FilterKey>("Nearest");
	const [activePromoIndex, setActivePromoIndex] = useState(0);
	const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderRelease: (evt, gestureState) => {
				const { dx } = gestureState;
				if (dx > 50) {
					// Swipe right - go to previous slide
					setActivePromoIndex((current) => (current - 1 + promoSlides.length) % promoSlides.length);
				} else if (dx < -50) {
					// Swipe left - go to next slide
					setActivePromoIndex((current) => (current + 1) % promoSlides.length);
				}
			},
		})
	).current;

	const activePromo = promoSlides[activePromoIndex];

	useEffect(() => {
		let mounted = true;

		const loadUserLocation = async () => {
			const currentLocation = await getCurrentUserLocation();
			if (mounted && currentLocation) {
				setUserLocation(currentLocation);
			}
		};

		loadUserLocation();

		return () => {
			mounted = false;
		};
	}, []);

	const parseDistanceKm = (distance: string) => Number.parseFloat(distance.replace(" km", ""));

	const parseMeridiemTime = (time: string) => {
		const normalized = time.trim().toLowerCase();
		const [hourMinutePart, meridiem] = normalized.split(" ");
		if (!hourMinutePart || !meridiem) {
			return null;
		}

		const [hourPart, minutePart = "0"] = hourMinutePart.split(".");
		const hourNumber = Number.parseInt(hourPart, 10);
		const minuteNumber = Number.parseInt(minutePart, 10);
		if (Number.isNaN(hourNumber) || Number.isNaN(minuteNumber)) {
			return null;
		}

		let parsedHour = hourNumber;
		if (meridiem === "pm" && parsedHour < 12) {
			parsedHour += 12;
		}
		if (meridiem === "am" && parsedHour === 12) {
			parsedHour = 0;
		}

		return parsedHour * 60 + minuteNumber;
	};

	const isOpenNow = (center: ServiceCenter) => {
		const openAtMinutes = 9 * 60;
		const closeAtMinutes = parseMeridiemTime(center.closesAt);
		if (closeAtMinutes === null) {
			return center.status === "Open";
		}

		const now = new Date();
		const nowMinutes = now.getHours() * 60 + now.getMinutes();
		return center.status === "Open" && nowMinutes >= openAtMinutes && nowMinutes <= closeAtMinutes;
	};

	const getDistanceKm = (center: ServiceCenter) => {
		if (!userLocation) {
			return parseDistanceKm(center.distance);
		}

		const toRadians = (value: number) => (value * Math.PI) / 180;
		const earthRadiusKm = 6371;
		const latitudeDistance = toRadians(center.latitude - userLocation.latitude);
		const longitudeDistance = toRadians(center.longitude - userLocation.longitude);

		const a =
			Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
			Math.cos(toRadians(userLocation.latitude)) *
				Math.cos(toRadians(center.latitude)) *
				Math.sin(longitudeDistance / 2) *
				Math.sin(longitudeDistance / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusKm * c;
	};

	const centersWithDistance = useMemo(() => {
		return serviceCenters.map((center) => {
			const computedDistanceKm = getDistanceKm(center);

			return {
				...center,
				computedDistanceKm,
				computedDistanceLabel: `${computedDistanceKm.toFixed(1)} km`,
			};
		});
	}, [userLocation]);

	const visibleServiceCenters = useMemo(() => {
		if (activeFilter === "Top Rated") {
			return [...centersWithDistance].sort((left, right) => {
				if (right.rating !== left.rating) {
					return right.rating - left.rating;
				}
				return right.reviews - left.reviews;
			});
		}

		if (activeFilter === "Open Now") {
			return centersWithDistance.filter((center) => isOpenNow(center));
		}

		if (activeFilter === "Nearest") {
			return [...centersWithDistance].sort((left, right) => {
				if (left.computedDistanceKm !== right.computedDistanceKm) {
					return left.computedDistanceKm - right.computedDistanceKm;
				}
				return left.name.localeCompare(right.name);
			});
		}

		return centersWithDistance;
	}, [activeFilter, centersWithDistance]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.topRow}>
					<View style={styles.searchContainer}>
						<Feather name="search" size={26} color={defaultColor.primary.backgroundColor} />
						<TextInput placeholder="Search service or store..." placeholderTextColor="#97A2B8" style={styles.searchInput} />
					</View>

					<Pressable style={styles.profileButton} accessibilityRole="button">
					<Feather name="user" size={24} color="#111827" />
					</Pressable>
				</View>

						<View style={styles.offerCard} {...panResponder.panHandlers}>
							<Svg width="100%" height="100%" viewBox="0 0 100 100" style={styles.offerGradient} preserveAspectRatio="none" pointerEvents="none">
								<Defs>
									<LinearGradient id="promoGradient" x1="0" y1="0" x2="1" y2="0">
										<Stop offset="0%" stopColor="#DCEBFF" stopOpacity="1" />
										<Stop offset="55%" stopColor="#EEF5FF" stopOpacity="1" />
										<Stop offset="100%" stopColor="#EAF3FF" stopOpacity="1" />
									</LinearGradient>
								</Defs>
								<Rect x="0" y="0" width="100" height="100" fill="url(#promoGradient)" />
							</Svg>
				<View style={styles.offerTextBlock}>
					<Text style={styles.offerTitle}>{activePromo.title}</Text>
					<Text style={styles.offerSubtitle}>{activePromo.subtitle}</Text>
				</View>

				<Image source={activePromo.image} style={styles.offerImage} resizeMode="contain" />
				</View>

				<View style={styles.paginationRow}>
					{promoSlides.map((_, index) => (
					<View
						key={`promo-dot-${index}`}
						style={[styles.paginationDot, index === activePromoIndex && styles.paginationDotActive]}
					/>
				))}
			</View>

			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>Recommended For You</Text>
			</View>
				<View style={styles.filterRow}>
					{filters.map((filter) => {
						const isActive = filter === activeFilter;

						return (
							<Pressable key={filter} style={[styles.filterChip, isActive && styles.filterChipActive]} onPress={() => setActiveFilter(filter)}>
								{filter === "Nearest" ? (
									<FontAwesome6 name="location-dot" size={14} color={isActive ? defaultColor.primary.backgroundColor : "#1F2937"} />
								) : filter === "Top Rated" ? (
									<Feather name="star" size={14} color={isActive ? defaultColor.primary.backgroundColor : "#1F2937"} />
								) : filter === "Open Now" ? (
									<Feather name="clock" size={14} color={isActive ? defaultColor.primary.backgroundColor : "#1F2937"} />
								) : (
									<Feather name="sliders" size={14} color={isActive ? defaultColor.primary.backgroundColor : "#1F2937"} />
								)}
								<Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
							</Pressable>
						);
					})}
				</View>

				<View style={styles.cardsContainer}>
					{visibleServiceCenters.map((serviceCenter) => {
						const distanceLabel = serviceCenter.computedDistanceLabel;

						return (
						<Pressable
							key={serviceCenter.name}
							style={styles.serviceCard}
							onPress={() =>
								router.push({
									pathname: "/user/details",
									params: {
										name: serviceCenter.name,
										rating: serviceCenter.rating.toString(),
										closesAt: serviceCenter.closesAt,
										address: serviceCenter.address,
										distance: distanceLabel,
									},
								})
							}
						>
							<Image source={serviceCenter.image} style={styles.serviceImage} resizeMode="cover" />

							<View style={styles.serviceInfo}>
								<Text style={styles.serviceTitle} numberOfLines={2}>
									{serviceCenter.name}
								</Text>

								<View style={styles.ratingStatusRow}>
									<Feather name="star" size={15} color="#FBBF24" />
									<Text style={styles.ratingText}>{serviceCenter.rating.toFixed(1)}</Text>
									<Text style={styles.separatorText}>·</Text>
									<Text style={styles.statusText}>{serviceCenter.status}</Text>
									<Text style={styles.separatorText}>·</Text>
									<Text style={styles.closesText}>Closes {serviceCenter.closesAt}</Text>
								</View>

								<View style={styles.addressRow}>
									<Feather name="map-pin" size={13} color="#6B7280" />
									<Text style={styles.addressText} numberOfLines={1}>
										{serviceCenter.address}
									</Text>
								</View>
							</View>

							<View style={styles.distanceContainer}>
								<Feather name="map-pin" size={18} color={defaultColor.primary.backgroundColor} />
								<Text style={styles.distanceValue}>{distanceLabel}</Text>
							</View>
						</Pressable>
						);
					})}
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
	content: {
		paddingHorizontal: 20,
		paddingTop: 6,
		paddingBottom: 116,
	},
	topRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 16,
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 24,
		borderWidth: 1.2,
		borderColor: "#E5E7EB",
		paddingHorizontal: 14,
		height: 54,
		shadowColor: "#D1D5DB",
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 13,
		color: "#111827",
		fontWeight: "500",
	},
	profileButton: {
		width: 54,
		height: 54,
		borderRadius: 27,
		borderWidth: 1.2,
		borderColor: "#E5E7EB",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		shadowColor: "#D1D5DB",
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	offerCard: {
		borderRadius: 28,
		aspectRatio: 2.75,
		minHeight: 128,
		maxHeight: 152,
		overflow: "hidden",
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		position: "relative",
	},
		offerTextBlock: {
		flex: 1,
		paddingRight: 8,
		paddingLeft: 8,
		justifyContent: "center",
		paddingTop: 0,
		maxWidth: "50%",
		zIndex: 2,
	},
	offerTitle: {
		fontSize: 17,
		lineHeight: 22,
		fontWeight: "800",
		color: "#0F172A",
		letterSpacing: -0.5,
		marginBottom: 5,
	},
	offerSubtitle: {
		fontSize: 11.5,
		lineHeight: 16,
		fontWeight: "500",
		color: "#64748B",
	},
		offerImage: {
		width: "48%",
		height: "95%",
		position: "absolute",
		right: 8,
		top: 4,
		zIndex: 3,
	},
	offerGradient: {
		position: "absolute",
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		borderRadius: 28,
	},
	paginationRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 9,
		marginBottom: 20,
	},
	paginationDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#CBD5E0",
	},
	paginationDotActive: {
		backgroundColor: "#2D6BFF",
		transform: [{ scale: 1.12 }],
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1F2937",
	},
	filterRow: {
		flexDirection: "row",
		gap: 6,
		marginBottom: 16,
		flexWrap: "nowrap",
	},
	filterChip: {
		flex: 1,
		paddingHorizontal: 6,
		height: 40,
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
		shadowColor: "#D1D9E8",
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	filterChipActive: {
		borderColor: "#3B82F6",
		backgroundColor: "#EFF6FF",
	},
	filterText: {
		fontSize: 11,
		fontWeight: "700",
		color: "#64748B",
	},
	filterTextActive: {
		color: "#3B82F6",
	},
	cardsContainer: {
		gap: 14,
	},
	serviceCard: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: "#FFFFFF",
		borderRadius: 13,
		paddingVertical: 10,
		paddingHorizontal: 10,
		shadowColor: "#E6EEF9",
		shadowOpacity: 0.1,
		shadowRadius: 7,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	serviceImage: {
		width: 84,
		height: 84,
		borderRadius: 9,
		marginRight: 12,
	},
	serviceInfo: {
		flex: 1,
		paddingTop: 1,
	},
	serviceTitle: {
		fontSize: 15.5,
		fontWeight: "700",
		color: "#0F172A",
		marginBottom: 4,
		lineHeight: 19,
	},
	ratingStatusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginBottom: 4,
	},
	ratingText: {
		fontSize: 12.5,
		fontWeight: "500",
		color: "#374151",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "500",
		color: "#10B981",
	},
	separatorText: {
		color: "#9CA3AF",
		fontSize: 13,
	},
	closesText: {
		color: "#6B7280",
		fontSize: 12,
		fontWeight: "400",
	},
	addressRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 2,
	},
	addressText: {
		color: "#6B7280",
		fontSize: 11,
		fontWeight: "400",
		flex: 1,
	},
	distanceContainer: {
		alignItems: "center",
		justifyContent: "flex-start",
		marginLeft: 8,
		paddingTop: 1,
	},
	distanceValue: {
		color: "#2D6BFF",
		fontSize: 12.5,
		fontWeight: "500",
	},
});

export default dashboard;
