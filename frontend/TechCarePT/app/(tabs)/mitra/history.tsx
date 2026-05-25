import { useEffect, useState } from "react";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import { ActivityIndicator, View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.backgroundColor,
  },
  title: {
    padding: 12,
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginLeft: 20,
  },
  earningsContainer: {
    padding: 16,
    alignContent: "center",
    alignItems: "center",
  },
  earningsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  earningsSum: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },
  breakdownContainer: {
    backgroundColor: "#fefefe",
    padding: 16,
    width: "75%",
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  breakdownSection: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownTotal: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  breakdownType: {
    fontSize: 12,
    fontWeight: "500",
  },
  historyContainer: {},
  transactionContainer: {
    padding: 16,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  transactionViewText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary.backgroundColor,
  },
  transactionItem: {
    padding: 12,
    backgroundColor: "#fefefe",
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d1d5db",
    marginBottom: 8,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
  },
  transactionServiceType: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  transactionTime: {
    fontSize: 12,
    color: "#6B7280",
  },
});

type HistoryBackendOrder = {
  id_order?: number | string;
  id?: number | string;
  created_at?: string | null;
  waktu_reservasi?: string | null;
  tipe_order?: "reservasi" | "home_service";
  alamat_home_service?: string | null;
  status_order?: string | null;
  user?: {
    name?: string | null;
  } | null;
  service?: {
    nama_service?: string | null;
    harga_service?: number | string | null;
    serviceCenter?: {
      lokasi_service_center?: string | null;
      jarak_service_center?: number | string | null;
      name_service_center?: string | null;
    } | null;
    service_center?: {
      lokasi_service_center?: string | null;
      jarak_service_center?: number | string | null;
      name_service_center?: string | null;
    } | null;
  } | null;
};

type HistoryTransaction = {
  id: string;
  name: string;
  serviceType: string;
  serviceVariant: "Home Service" | "Scheduled Service";
  priceLabel: string;
  priceValue: number;
  time: string;
  location: string;
  distance: string;
};

const API_BASE_URL = "https://herbal-ungodly-reformed.ngrok-free.dev/api";

const formatCurrency = (value?: number | string | null) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Rp0";
  }

  return `Rp${numericValue.toLocaleString("id-ID")}`;
};

const formatDistance = (value?: number | string | null) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0 km away";
  }

  return `${numericValue.toLocaleString("id-ID", { maximumFractionDigits: 2 })} km away`;
};

const formatTime = (backendOrder: HistoryBackendOrder) => {
  const source = backendOrder.waktu_reservasi || backendOrder.created_at;

  if (!source) {
    return "Just now";
  }

  const parsedDate = new Date(source);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Just now";
  }

  return parsedDate.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const transformHistoryOrder = (apiOrder: HistoryBackendOrder): HistoryTransaction => {
  const serviceCenter = apiOrder.service?.serviceCenter || apiOrder.service?.service_center;
  const serviceVariant: HistoryTransaction["serviceVariant"] = apiOrder.tipe_order === "home_service" ? "Home Service" : "Scheduled Service";

  return {
    id: apiOrder.id_order?.toString() || apiOrder.id?.toString() || "",
    name: apiOrder.user?.name || "User",
    serviceType: apiOrder.service?.nama_service || "Service",
    serviceVariant,
    priceLabel: formatCurrency(apiOrder.service?.harga_service),
    priceValue: Number(apiOrder.service?.harga_service) || 0,
    time: formatTime(apiOrder),
    location: apiOrder.alamat_home_service || serviceCenter?.lokasi_service_center || serviceCenter?.name_service_center || "Location not specified",
    distance: formatDistance(serviceCenter?.jarak_service_center),
  };
};

export default function MitraHistoryScreen() {
  const [historyOrders, setHistoryOrders] = useState<HistoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHistoryMitraData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/mitra/orders?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const ordersArray = Array.isArray(json.orders) ? json.orders : Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];

      setHistoryOrders(ordersArray.map((order: HistoryBackendOrder) => transformHistoryOrder(order)));
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error("Error fetching history mitra data:", errorMessage);
      setError(errorMessage);
      setHistoryOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHistoryMitraData();
  }, []);

  const totalEarnings = historyOrders.reduce((sum, order) => sum + order.priceValue, 0);
  const homeServiceCount = historyOrders.filter((order) => order.serviceVariant === "Home Service").length;
  const scheduledServiceCount = historyOrders.filter((order) => order.serviceVariant === "Scheduled Service").length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.historyContainer}>
        <View>
          <Text style={styles.title}>History</Text>
        </View>

        <View style={styles.earningsContainer}>
          <Text style={styles.earningsTitle}>Earnings Today</Text>
          <Text style={styles.earningsSum}>{formatCurrency(totalEarnings)}</Text>
          <Text></Text>
        </View>

        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownSection}>
            <View>
              <Text style={styles.breakdownTotal}>{homeServiceCount}</Text>
              <Text style={styles.breakdownType}>Home Service</Text>
            </View>
            <View>
              <Text style={styles.breakdownTotal}>{scheduledServiceCount}</Text>
              <Text style={styles.breakdownType}>Scheduled Service</Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionContainer}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionSectionTitle}>Recent Transaction</Text>
            <TouchableOpacity>
              <Text style={styles.transactionViewText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color={colors.primary.backgroundColor} />
            </View>
          ) : error ? (
            <Text style={{ color: "#B91C1C", marginTop: 8 }}>{error}</Text>
          ) : historyOrders.length === 0 ? (
            <Text style={{ color: "#6B7280", marginTop: 8 }}>No completed orders found yet.</Text>
          ) : (
            <View>
              {historyOrders.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.avatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.transactionName}>{transaction.name}</Text>
                    <Text style={styles.transactionServiceType}>{transaction.serviceType}</Text>
                    <Text style={styles.transactionTime}>{transaction.serviceVariant}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.transactionPrice}>{transaction.priceLabel}</Text>
                    <Text style={styles.transactionTime}>{transaction.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <MitraBottomNavigation />
    </View>
  );
}
