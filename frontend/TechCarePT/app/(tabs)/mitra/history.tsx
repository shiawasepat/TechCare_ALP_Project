import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
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
    fontSize: 14,
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

export default function MitraHistoryScreen() {
  const historyData = [
    {
      id: 1,
      name: "Laury",
      serviceType: "Home Service",
      price: "Rp 150.000",
      time: "10:00 AM",
    },
    {
      id: 2,
      name: "John",
      serviceType: "Scheduled Service",
      price: "Rp 200.000",
      time: "2:00 PM",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.historyContainer}>
        <View>
          <Text style={styles.title}>History</Text>
        </View>

        <View style={styles.earningsContainer}>
          <Text style={styles.earningsTitle}>Earnings Today</Text>
          <Text style={styles.earningsSum}>Rp 150.000</Text>
          <Text></Text>
        </View>

        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Earnings Breakdown</Text>
          <View style={styles.breakdownSection}>
            <View>
              <Text style={styles.breakdownTotal}>8</Text>
              <Text style={styles.breakdownType}>Home Service</Text>
            </View>
            <View>
              <Text style={styles.breakdownTotal}>10</Text>
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
          <View>
            {historyData.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={styles.transactionServiceType}>{transaction.serviceType}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.transactionPrice}>{transaction.price}</Text>
                  <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <MitraBottomNavigation />
    </View>
  );
}
