import { Platform } from "react-native";

export type UserLocation = {
	latitude: number;
	longitude: number;
};

export async function getCurrentUserLocation(): Promise<UserLocation | null> {
	try {
		if (Platform.OS === "web") {
			if (typeof navigator === "undefined" || !navigator.geolocation) {
				return null;
			}

			return await new Promise<UserLocation | null>((resolve) => {
				try {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							resolve({
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
							});
						},
						() => resolve(null),
						{ enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
					);
				} catch {
					resolve(null);
				}
			});
		}

		const Location = await import("expo-location");
		const permission = await Location.requestForegroundPermissionsAsync();
		if (permission.status !== "granted") {
			return null;
		}

		let current;
		try {
			current = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});
		} catch {
			current = await Location.getLastKnownPositionAsync();
		}

		if (!current) {
			return null;
		}

		return {
			latitude: current.coords.latitude,
			longitude: current.coords.longitude,
		};
	} catch {
		return null;
	}
}
