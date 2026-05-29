import Constants from "expo-constants";

const DEFAULT_API_SCHEME = process.env.EXPO_PUBLIC_API_SCHEME?.trim() || "http";
const DEFAULT_API_PORT = process.env.EXPO_PUBLIC_API_PORT?.trim() || "8000";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const cleanValue = (value?: string) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

const getExpoHostUri = (): string | null => {
	const candidates = [
		Constants.expoConfig?.hostUri,
		(Constants as any).expoGoConfig?.hostUri,
		(Constants as any).expoGoConfig?.debuggerHost,
		(Constants as any).manifest?.debuggerHost,
		(Constants as any).manifest2?.extra?.expoClient?.hostUri,
	];

	for (const candidate of candidates) {
		const value = cleanValue(candidate);
		if (value) {
			return value;
		}
	}

	return null;
};

const extractHostName = (hostUri: string): string | null => {
	const withoutScheme = hostUri.replace(/^[a-z]+:\/\//i, "");
	const withoutPath = withoutScheme.split("/")[0];
	const host = withoutPath.split(":")[0]?.trim();
	return host ? host : null;
};

const resolveApiHost = (): string => {
	const explicitHost = cleanValue(process.env.EXPO_PUBLIC_API_HOST);
	if (explicitHost) {
		return explicitHost;
	}

	const hostFromExpo = getExpoHostUri();
	const resolvedHost = hostFromExpo ? extractHostName(hostFromExpo) : null;
	return resolvedHost || "127.0.0.1";
};

const resolveApiOrigin = (): string => {
	const explicitOrigin = cleanValue(process.env.EXPO_PUBLIC_API_ORIGIN);
	if (explicitOrigin) {
		return stripTrailingSlash(explicitOrigin);
	}

	const explicitBaseUrl = cleanValue(process.env.EXPO_PUBLIC_API_BASE_URL);
	if (explicitBaseUrl) {
		return stripTrailingSlash(explicitBaseUrl).replace(/\/api\/?$/, "");
	}

	return `${DEFAULT_API_SCHEME}://${resolveApiHost()}:${DEFAULT_API_PORT}`;
};

export const API_ORIGIN = resolveApiOrigin();
export const API_BASE_URL = `${stripTrailingSlash(API_ORIGIN)}/api`;
export const PUSHER_APP_KEY = process.env.EXPO_PUBLIC_PUSHER_APP_KEY ?? "";
export const PUSHER_APP_CLUSTER = process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER ?? "ap1";