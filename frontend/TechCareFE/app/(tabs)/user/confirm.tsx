import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButtonHeader from "@/components/BackButtonHeader";
import { API_BASE_URL } from "@/constants/api";

type ServiceVariant = "Home Service" | "Scheduled Service";

type ServiceOption = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const SHIPPING_COST = 10000;
const PLATFORM_FEE = 2500;
const DEFAULT_HOME_PRICE = 110000;
const DEFAULT_SCHEDULED_PRICE = 90000;

const parseMoney = (value?: string | number) => {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const parsed = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeVariant = (value?: string): ServiceVariant => {
  return value === "Home Service" ? "Home Service" : "Scheduled Service";
};

export default function Scheduled() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    service_center?: string;
    service_center_name?: string;
    selected_service_id?: string;
    selected_service_name?: string;
    selected_service_price?: string;
    selected_service_description?: string;
    service_variant?: string;
    name?: string;
  }>();

  const serviceCenterId = typeof params.service_center === "string" ? params.service_center : "";
  const initialServiceCenterName = typeof params.service_center_name === "string" ? params.service_center_name : "Service Center Location";
  const initialServiceCenterAddress = "Jl. Tech Service No. 123, Jakarta";
  const initialServiceName = typeof params.selected_service_name === "string" && params.selected_service_name.length > 0 ? params.selected_service_name : typeof params.name === "string" ? params.name : "Laptop Service";
  const initialServicePrice = parseMoney(params.selected_service_price);
  const initialServiceDescription = typeof params.selected_service_description === "string" ? params.selected_service_description : "";
  const initialVariant = normalizeVariant(typeof params.service_variant === "string" ? params.service_variant : undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [serviceCenterName, setServiceCenterName] = useState(initialServiceCenterName);
  const [serviceCenterAddress, setServiceCenterAddress] = useState(initialServiceCenterAddress);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [selectedServiceName, setSelectedServiceName] = useState(initialServiceName);
  const [selectedServicePrice, setSelectedServicePrice] = useState(initialServicePrice || (initialVariant === "Home Service" ? DEFAULT_HOME_PRICE : DEFAULT_SCHEDULED_PRICE));
  const [selectedServiceDescription, setSelectedServiceDescription] = useState(initialServiceDescription || "Review details before continuing");
  const [serviceVariant, setServiceVariant] = useState<ServiceVariant>(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isCustomizeModalVisible, setIsCustomizeModalVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchServiceCenter = async () => {
      if (!serviceCenterId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/service_centers/${serviceCenterId}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const text = await response.text();
        let json: any = null;

        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          json = null;
        }

        if (!response.ok) {
          throw new Error(json?.message || text || `Failed to load service center (${response.status})`);
        }

        const payload = json || {};
        const data = payload.data || payload || {};
        const services = Array.isArray(data.services || payload.services) ? data.services || payload.services : [];

        if (!active) {
          return;
        }

        setServiceCenterName(data.name_service_center || data.name || initialServiceCenterName);
        setServiceCenterAddress(data.lokasi || data.location || data.address || initialServiceCenterAddress);

        const mappedServices: ServiceOption[] = services.map((service: any, index: number) => ({
          id: String(service.id_service ?? service.id ?? index),
          name: service.nama_service || service.name || service.title || `Service ${index + 1}`,
          price: typeof service.harga_service === "number" ? service.harga_service : parseMoney(service.price),
          description: service.deskripsi_service || service.description || "",
        }));

        setServiceOptions(mappedServices);

        const serviceMatch = mappedServices.find((service) => service.id === String(params.selected_service_id || "") || service.name === initialServiceName);

        if (serviceMatch) {
          setSelectedServiceName(serviceMatch.name);
          setSelectedServicePrice(serviceMatch.price || (initialVariant === "Home Service" ? DEFAULT_HOME_PRICE : DEFAULT_SCHEDULED_PRICE));
          setSelectedServiceDescription(serviceMatch.description || initialServiceDescription || "");
        } else if (!initialServicePrice && mappedServices.length > 0) {
          const fallbackService = mappedServices[0];
          setSelectedServiceName(fallbackService.name);
          setSelectedServicePrice(fallbackService.price);
          setSelectedServiceDescription(fallbackService.description || "");
        }
      } catch (error) {
        console.error("Failed to load service center for confirm screen:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchServiceCenter();

    return () => {
      active = false;
    };
  }, [initialServiceDescription, initialServiceName, initialServicePrice, initialVariant, params.selected_service_id, serviceCenterId, initialServiceCenterAddress, initialServiceCenterName]);

  const isHomeService = serviceVariant === "Home Service";
  const subtotal = selectedServicePrice * quantity;
  const total = subtotal + PLATFORM_FEE + (isHomeService ? SHIPPING_COST : 0);
  const displayServiceName = serviceOptions.length > 0 ? selectedServiceName : selectedServiceName || initialServiceName;

  const saveCustomization = () => {
    setIsCustomizeModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <BackButtonHeader title="Confirm Order" subtitle={serviceCenterName} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.summaryIconWrap}>
              <Feather name="clipboard" size={20} color="#2D6BFF" />
            </View>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.cardTitle}>Order summary</Text>
              <Text style={styles.cardSubtitle}>Review details before continuing</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{serviceVariant}</Text>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceItemName}>{displayServiceName}</Text>
              <Text style={styles.serviceItemDesc}>{selectedServiceDescription || "Review details before continuing"}</Text>
              <Text style={styles.serviceMeta}>Qty {quantity} · Est. 2-3 hours</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.servicePrice}>Rp{selectedServicePrice.toLocaleString("id-ID")}</Text>
              <TouchableOpacity style={styles.editChip} onPress={() => setIsCustomizeModalVisible(true)}>
                <Text style={styles.editChipText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.variantRow}>
            <Pressable onPress={() => setServiceVariant("Home Service")} style={[styles.variantChip, isHomeService && styles.variantChipActive]}>
              <Text style={[styles.variantChipText, isHomeService && styles.variantChipTextActive]}>Home Service</Text>
            </Pressable>
            <Pressable onPress={() => setServiceVariant("Scheduled Service")} style={[styles.variantChip, !isHomeService && styles.variantChipActive]}>
              <Text style={[styles.variantChipText, !isHomeService && styles.variantChipTextActive]}>Scheduled Service</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pricing breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal (Tax included)</Text>
            <Text style={styles.priceValue}>Rp{subtotal.toLocaleString("id-ID")}</Text>
          </View>
          {isHomeService ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping cost</Text>
              <Text style={styles.priceValue}>Rp{SHIPPING_COST.toLocaleString("id-ID")}</Text>
            </View>
          ) : null}
          <View style={styles.priceRowLast}>
            <Text style={styles.priceLabel}>Platform fee</Text>
            <Text style={styles.priceValue}>Rp{PLATFORM_FEE.toLocaleString("id-ID")}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service notes</Text>
          <View style={styles.notesCard}>
            <MaterialIcons name="description" size={20} color="#2D6BFF" />
            <View style={styles.notesContent}>
              <Text style={styles.notesLabel}>Add special notes</Text>
              <Text style={styles.notesDesc}>Optional, for additional instructions to the technician.</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service location</Text>
          <View style={styles.locationCard}>
            <Ionicons name="location-sharp" size={22} color="#2D6BFF" />
            <View style={styles.locationContent}>
              <Text style={styles.locationName}>{serviceCenterName}</Text>
              <Text style={styles.locationMeta}>{serviceCenterAddress}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </View>
          <View style={styles.locationMethods}>
            <TouchableOpacity style={styles.methodButton}>
              <MaterialIcons name="contact-mail" size={18} color="#2D6BFF" />
              <Text style={styles.methodText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodButton}>
              <MaterialCommunityIcons name="map-marker" size={18} color="#2D6BFF" />
              <Text style={styles.methodText}>View location</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total price</Text>
            <Text style={styles.totalPrice}>Rp{total.toLocaleString("id-ID")}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isCustomizeModalVisible} transparent animationType="fade" onRequestClose={() => setIsCustomizeModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Customize order</Text>
            <Text style={styles.modalSubtitle}>Adjust the service type, quantity, or notes before checkout.</Text>

            <Text style={styles.modalLabel}>Service type</Text>
            <View style={styles.modalVariantRow}>
              <Pressable onPress={() => setServiceVariant("Home Service")} style={[styles.modalVariantChip, isHomeService && styles.modalVariantChipActive]}>
                <Text style={[styles.modalVariantText, isHomeService && styles.modalVariantTextActive]}>Home Service</Text>
              </Pressable>
              <Pressable onPress={() => setServiceVariant("Scheduled Service")} style={[styles.modalVariantChip, !isHomeService && styles.modalVariantChipActive]}>
                <Text style={[styles.modalVariantText, !isHomeService && styles.modalVariantTextActive]}>Scheduled Service</Text>
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>Quantity</Text>
            <View style={styles.quantityRow}>
              <Pressable style={styles.quantityButton} onPress={() => setQuantity((current) => Math.max(1, current - 1))}>
                <Feather name="minus" size={18} color="#2D6BFF" />
              </Pressable>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <Pressable style={styles.quantityButton} onPress={() => setQuantity((current) => current + 1)}>
                <Feather name="plus" size={18} color="#2D6BFF" />
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>Special instructions</Text>
            <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} placeholder="Add anything the technician should know" placeholderTextColor="#9CA3AF" multiline style={styles.textArea} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={() => setIsCustomizeModalVisible(false)}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryButton} onPress={saveCustomization}>
                <Text style={styles.modalPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#2D6BFF" />
            <Text style={styles.loadingText}>Loading selected service...</Text>
          </View>
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
  content: {
    paddingHorizontal: 20,
    // paddingTop: 10,
    paddingBottom: 28,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#4B5563",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2D6BFF",
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    padding: 14,
    borderRadius: 18,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceItemName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  serviceItemDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  serviceMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  editChip: {
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  editChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2D6BFF",
  },
  variantRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  variantChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  variantChipActive: {
    backgroundColor: "#EEF4FF",
    borderColor: "#2D6BFF",
  },
  variantChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  variantChipTextActive: {
    color: "#2D6BFF",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  priceRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  notesCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
  },
  notesContent: {
    flex: 1,
    marginLeft: 12,
  },
  notesLabel: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  notesDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFF",
    borderRadius: 18,
    marginBottom: 12,
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  locationMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  locationMethods: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#EEF4FF",
    borderRadius: 14,
    gap: 6,
  },
  methodText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2D6BFF",
  },
  totalSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  footer: {
    padding: 16,
    backgroundColor: "#F6F9FF",
  },
  confirmButton: {
    backgroundColor: "#2D6BFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2D6BFF",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginTop: 6,
  },
  modalVariantRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  modalVariantChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modalVariantChipActive: {
    backgroundColor: "#EEF4FF",
    borderColor: "#2D6BFF",
  },
  modalVariantText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  modalVariantTextActive: {
    color: "#2D6BFF",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    minWidth: 24,
    textAlign: "center",
  },
  textArea: {
    minHeight: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#111827",
    textAlignVertical: "top",
    backgroundColor: "#FFFFFF",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalSecondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D6BFF",
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#2D6BFF",
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(246, 249, 255, 0.5)",
  },
  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#D8E1EF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  loadingText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
});
