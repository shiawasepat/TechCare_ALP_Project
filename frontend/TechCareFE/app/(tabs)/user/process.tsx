import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, Touchable, Alert } from "react-native";
import { colors } from "@/styles/colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import BackButtonHeader from "@/components/BackButtonHeader";
import { router } from "expo-router";
import { useState } from "react";

export default function UserProcess() {
  const showFinishDialog = () => {
    Alert.alert("Finish Order?", "Are you sure you want to finish this order? This action cannot be undone.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled"),
        style: "cancel",
      },
      {
        text: "Force Finish",
        onPress: () => {
          console.log("Order finished");
          // Add your finish order logic here
          setCurrentStep(4);
        },
        style: "destructive",
      },
    ]);
  };
  const [currentStep, setCurrentStep] = useState(3); // 1: Waiting Approval, 2: Waiting for Customer, 3: Fixing, 4: Finished

  const steps = [
    { id: 1, label: "Waiting\nApproval" },
    { id: 2, label: "Waiting for\n Customer" },
    { id: 3, label: "Processing" },
    { id: 4, label: "Finished" },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <BackButtonHeader title="Order Status" onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.trackingSection}>
            <View style={styles.invoiceContainer}>
              <Text style={styles.invoiceText}>Order No.</Text>
              <Text style={styles.invoiceText}>:</Text>
              <Text style={styles.invoiceText}>TC-001</Text>
            </View>
            <Text style={styles.estimatedArrivalLabel}>Expect to arrive at:</Text>
            <Text style={styles.estimatedArrivalTime}>10:30 AM</Text>
          </View>
          <View style={styles.progressTrackingSection}>
            <Text style={styles.progressTrackingTitle}>Order Status</Text>
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.id} style={{ flex: 1, alignItems: "center" }}>
                  <View style={styles.step}>
                    <View style={[styles.stepCircle, step.id < currentStep && styles.stepCircleCompleted, step.id === currentStep && styles.stepCircleActive]}>
                      {step.id < currentStep ? (
                        <Feather name="check" style={[styles.stepCircleText, { color: "#fff", fontSize: 24 }]} />
                      ) : (
                        <Text style={[styles.stepCircleText, step.id === currentStep && styles.stepCircleTextActive]}>{step.id}</Text>
                      )}
                    </View>
                    <Text style={[styles.stepLabel, step.id < currentStep && styles.stepLabelCompleted, step.id === currentStep && styles.stepLabelActive]}>{step.label}</Text>
                  </View>

                  {index < steps.length - 1 && <View style={[styles.stepConnector, step.id < currentStep && styles.stepConnectorActive]} />}
                </View>
              ))}
            </View>
          </View>
          {/* Order Summary */}
          <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>Order Summary</Text>
            <View style={styles.orderDetails}>
              <View style={styles.orderSection}>
                <Text style={styles.orderService}>Service Type</Text>
                <Text style={styles.orderPrice}>Price</Text>
              </View>
              <View style={styles.orderValue}>
                <Text style={styles.orderService}>Change Thermal Paste</Text>
                <Text style={styles.orderPrice}>Rp90.000</Text>
              </View>
            </View>
          </View>
          {currentStep === 4 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.finishedButton, { flex: 1 }]} disabled>
                <Text style={styles.myOrderButtonText}>Complete Order</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.cancelButton, { flex: 1, marginRight: 8 }]} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.myOrderButton, { flex: 1, marginBottom: 0 }]} onPress={showFinishDialog}>
                <Text style={styles.myOrderButtonText}>Force Finish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.backgroundColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#111827",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  mapContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 24,
    overflow: "hidden",
  },
  mapPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  contentContainer: {
    padding: 32,
  },
  trackingSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  invoiceContainer: {
    flexDirection: "row",
    gap: 8,
  },
  invoiceText: {
    fontSize: 14,
    color: colors.primary.backgroundColor,
    marginBottom: 16,
    fontWeight: "600",
  },
  estimatedArrivalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  estimatedArrivalTime: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary.backgroundColor,
  },
  estimatedArrivalUnit: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  driverSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  driverAvatarText: {
    fontSize: 32,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    fontSize: 20,
  },
  myOrderButton: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  myOrderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  progressTrackingSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  progressTrackingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: colors.primary.backgroundColor,
  },
  stepCircleCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepCircleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  stepCircleTextActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 8,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
  },
  stepLabelActive: {
    color: colors.primary.backgroundColor,
    fontWeight: "700",
  },
  stepLabelCompleted: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  stepConnector: {
    height: 2,
    backgroundColor: "#E5E7EB",
    flex: 1,
    marginHorizontal: 4,
  },
  stepConnectorActive: {
    backgroundColor: colors.primary.backgroundColor,
  },
  orderContainer: {
    marginBottom: 24,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  orderSection: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  orderValue: {
    marginBottom: 12,
    alignItems: "flex-end",
  },
  orderService: {
    fontSize: 12,
    color: "#111827",
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: 12,
    color: "#111827",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  finishedButton: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
});
