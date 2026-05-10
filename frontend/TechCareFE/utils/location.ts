import { Platform } from "react-native";

type Location = { latitude: number; longitude: number } | null;

export const getCurrentUserLocation = async (): Promise<Location> => {
	if (Platform.OS === "web") {
		return new Promise((resolve) => {
			if (!navigator.geolocation) {
				console.warn("Geolocation not available");
				resolve(null);
				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					resolve({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.warn("Geolocation error:", error);
					resolve(null);
				},
				{ timeout: 10000, enableHighAccuracy: false }
			);
		});
	}

	try {
		// Dynamic import for expo-location on native
		// @ts-ignore - expo-location is installed but TypeScript can't resolve dynamic import at compile time
		const ExpoLocation: any = await import("expo-location");
		const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.warn("Location permission not granted");
			const lastKnown = await ExpoLocation.getLastKnownPositionAsync();
			if (lastKnown) {
				return {
					latitude: lastKnown.coords.latitude,
					longitude: lastKnown.coords.longitude,
				};
			}
			return null;
		}

		const location = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
		return {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		};
	} catch (error) {
		console.warn("Error getting location:", error);
		return null;
	}
};
