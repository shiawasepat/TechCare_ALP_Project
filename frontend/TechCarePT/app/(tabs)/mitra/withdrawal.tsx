import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import { colors } from "@/styles/colors";

const API_BASE_URL = "https://herbal-ungodly-reformed.ngrok-free.dev/api";

const BANK_OPTIONS = ["BCA", "BRI", "BNI", "Mandiri", "BSI", "CIMB Niaga", "Permata", "Other"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function WithdrawalScreen() {
  const [availableBalance, setAvailableBalance] = React.useState(0);
  const [selectedBank, setSelectedBank] = React.useState(BANK_OPTIONS[0]);
  const [accountHolder, setAccountHolder] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getAuthToken = React.useCallback(async () => {
    const storedToken = await AsyncStorage.getItem("authToken");
    return storedToken?.trim() || null;
  }, []);

  const loadEarnings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();

      if (!token) {
        router.replace("/mitra/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/mitra/earnings/today`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const json = await response.json();
      const totalMoney = Number(json?.total_money_made ?? json?.data?.total_money_made ?? 0);
      const safeTotal = Number.isFinite(totalMoney) ? totalMoney : 0;
      setAvailableBalance(safeTotal);
      setWithdrawAmount(String(safeTotal || ""));
    } catch (error) {
      console.error("Failed to load earnings:", error);
      setAvailableBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken]);

  React.useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  const handleSubmitWithdrawal = async () => {
    const amount = Number(withdrawAmount);

    if (!selectedBank) {
      Alert.alert("Missing bank", "Please select a bank.");
      return;
    }

    if (!accountHolder.trim() || !accountNumber.trim()) {
      Alert.alert("Missing account details", "Please fill in the account holder name and bank account number.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Enter a valid withdrawal amount.");
      return;
    }

    if (amount > availableBalance) {
      Alert.alert("Amount too high", "You cannot withdraw more than your available balance.");
      return;
    }

    setIsSubmitting(true);
    try {
      Alert.alert("Withdrawal request ready", `Bank: ${selectedBank}\nAccount: ${accountHolder}\nNumber: ${accountNumber}\nAmount: ${formatCurrency(amount)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.headerCopy}>
              <Text style={styles.kicker}>Income withdrawal</Text>
              <Text style={styles.title}>Send your earnings to any bank account</Text>
              <Text style={styles.subtitle}>Choose a bank, fill in the recipient details, and prepare a withdrawal request from your available balance.</Text>
            </View>
            <View style={styles.balanceCard}>
              <MaterialCommunityIcons name="cash-multiple" size={22} color="#3278E7" />
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceValue}>{isLoading ? "Loading..." : formatCurrency(availableBalance)}</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Bank destination</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bankRow}>
              {BANK_OPTIONS.map((bank) => {
                const isActive = bank === selectedBank;

                return (
                  <TouchableOpacity key={bank} style={[styles.bankChip, isActive && styles.bankChipActive]} onPress={() => setSelectedBank(bank)}>
                    <Text style={[styles.bankChipText, isActive && styles.bankChipTextActive]}>{bank}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recipient details</Text>
            <TextInput style={styles.input} placeholder="Account holder name" placeholderTextColor="#94A3B8" value={accountHolder} onChangeText={setAccountHolder} />
            <TextInput style={styles.input} placeholder="Bank account number" placeholderTextColor="#94A3B8" keyboardType="number-pad" value={accountNumber} onChangeText={setAccountNumber} />
            <TextInput style={styles.input} placeholder="Withdrawal amount" placeholderTextColor="#94A3B8" keyboardType="numeric" value={withdrawAmount} onChangeText={setWithdrawAmount} />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Bank</Text>
              <Text style={styles.previewValue}>{selectedBank}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Account holder</Text>
              <Text style={styles.previewValue}>{accountHolder.trim() || "-"}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Account number</Text>
              <Text style={styles.previewValue}>{accountNumber.trim() || "-"}</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={handleSubmitWithdrawal} disabled={isSubmitting || isLoading}>
            <Text style={styles.submitButtonText}>{isSubmitting ? "Preparing request..." : "Withdraw income"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <MitraBottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.backgroundColor,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DCE7FB",
    shadowColor: "#C8D3E8",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerCopy: {
    gap: 6,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#3278E7",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
  },
  balanceCard: {
    marginTop: 18,
    backgroundColor: "#F0F7FF",
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  bankRow: {
    gap: 10,
    paddingRight: 4,
  },
  bankChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bankChipActive: {
    backgroundColor: colors.primary.backgroundColor,
    borderColor: colors.primary.backgroundColor,
  },
  bankChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  bankChipTextActive: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8E3F4",
    backgroundColor: "#FBFDFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  previewLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  previewValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
