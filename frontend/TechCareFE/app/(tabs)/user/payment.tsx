import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import BackButtonHeader from "@/components/BackButtonHeader";
import { API_BASE_URL } from "@/constants/api";

type SnapTokenResponse = {
  message?: string;
  snap_token?: string;
  payment_url?: string;
  client_key?: string;
  order_id?: number;
  gross_amount?: number;
  error?: string;
};

export default function Payment() {
  const params = useLocalSearchParams<{ orderId?: string; id_order?: string }>();
  const orderId = typeof params.orderId === "string" ? params.orderId : typeof params.id_order === "string" ? params.id_order : "";
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPaymentUrl = async () => {
      setLoading(true);
      setErrorMessage(null);

      if (!orderId) {
        setErrorMessage("Missing order id for payment.");
        setLoading(false);
        return;
      }

      const numericOrderId = Number(orderId);
      if (!Number.isFinite(numericOrderId)) {
        setErrorMessage("Invalid order id for payment.");
        setLoading(false);
        return;
      }

      const token = (await AsyncStorage.getItem("authToken"))?.trim();
      if (!token) {
        setErrorMessage("Please login again to continue with payment.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/payment/snap-token`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_order: numericOrderId }),
        });

        const body = (await response.json().catch(() => null)) as SnapTokenResponse | null;

        if (!response.ok) {
          throw new Error(body?.message || body?.error || `HTTP ${response.status}`);
        }

        const nextPaymentUrl = body?.payment_url || (body?.snap_token ? `https://app.sandbox.midtrans.com/snap/v2/vtweb/${body.snap_token}` : null);

        if (!nextPaymentUrl) {
          throw new Error("The backend did not return a payment URL.");
        }

        if (isActive) {
          setPaymentUrl(nextPaymentUrl);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (isActive) {
          setErrorMessage(message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadPaymentUrl();

    return () => {
      isActive = false;
    };
  }, [orderId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9FF" />
      <BackButtonHeader title="Payment" subtitle={orderId ? `Order #${orderId}` : "Midtrans checkout"} onBack={() => router.back()} />

      {loading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color="#2D6BFF" />
          <Text style={styles.stateTitle}>Preparing Midtrans checkout</Text>
          <Text style={styles.stateText}>Generating a fresh payment token from the backend.</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Payment unavailable</Text>
          <Text style={styles.stateText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      ) : paymentUrl ? (
        <View style={styles.webViewWrap}>
          <WebView
            source={{ uri: paymentUrl }}
            originWhitelist={["https://*"]}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webLoading}>
                <ActivityIndicator color="#2D6BFF" />
              </View>
            )}
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F9FF",
  },
  stateCard: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  stateText: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 6,
    backgroundColor: "#2D6BFF",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  webViewWrap: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  webLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
