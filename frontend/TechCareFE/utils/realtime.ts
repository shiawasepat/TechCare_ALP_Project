import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_ORIGIN, PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from "@/constants/api";

let echoInstance: Echo<any> | null = null;
const PusherClient = (Pusher as any).Pusher ?? Pusher;

export async function getEcho() {
    if (echoInstance) {
        return echoInstance;
    }

    const token = (await AsyncStorage.getItem("authToken"))?.trim();
    if (!token) {
        return null;
    }

    echoInstance = new Echo({
        broadcaster: "pusher",
        Pusher: PusherClient,
        key: PUSHER_APP_KEY,
        cluster: PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: `${API_ORIGIN}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}