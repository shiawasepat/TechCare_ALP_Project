import * as Location from "expo-location";

export type UserLocation = {
	latitude: number;
	longitude: number;
};

export async function getCurrentUserLocation(): Promise<UserLocation | null> {
	try {
		const permission = await Location.requestForegroundPermissionsAsync();
		if (permission.status !== "granted") {
			return null;
		}

		const current = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.Balanced,
		});

		return {
			latitude: current.coords.latitude,
			longitude: current.coords.longitude,
		};
	} catch {
		return null;
	}
}
