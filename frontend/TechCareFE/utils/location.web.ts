export type UserLocation = {
	latitude: number;
	longitude: number;
};

export async function getCurrentUserLocation(): Promise<UserLocation | null> {
	try {
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
	} catch {
		return null;
	}
}
