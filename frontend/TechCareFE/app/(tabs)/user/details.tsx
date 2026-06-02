import { Alert, Animated, Image, ImageSourcePropType, Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Easing, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors as defaultColor } from "@/styles/colors";
import { BackBtn } from "@/components/btn/back-btn";
import { SaveBtn } from "@/components/btn/save-btn";
import { ShareBtn } from "@/components/btn/share-btn";
import { StarIcon } from "@/components/svg/Star";
import { ServiceIcon } from "@/components/svg/Service";
import { ClockIcon } from "@/components/svg/Clock";
import { CheckIcon } from "@/components/svg/Check";
import { API_BASE_URL, API_ORIGIN } from "@/constants/api";

type ServiceCenterDetails = {
  id_service_center: number;
  name: string;
  address: string;
  rating: number;
  ratingCount: number;
  closesAt: string;
  distance: string;
  image: ImageSourcePropType;
};

type ServiceListItem = {
  id_service: number | string;
  name: string;
  price?: string;
  description?: string;
  raw: any;
};

export function details() {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState<any | null>(null);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [ratingsList, setRatingsList] = useState<any[]>([]);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ name?: string; address?: string; rating?: string; closesAt?: string; distance?: string; service_center?: string; id?: string }>();
  const serviceId = Array.isArray(params.service_center) ? params.service_center[0] : params.service_center || (Array.isArray(params.id) ? params.id[0] : params.id) || "";
  const serviceName = typeof params.name === "string" && params.name.length > 0 ? params.name : "";
  const serviceAddress = typeof params.address === "string" && params.address.length > 0 ? params.address : "";
  const serviceDistance = typeof params.distance === "string" && params.distance.length > 0 ? params.distance : "";
  const serviceClosesAt = typeof params.closesAt === "string" && params.closesAt.length > 0 ? params.closesAt : "";
  const ratingValue = typeof params.rating === "string" ? Number(params.rating) : "";
  const [activeTab, setActiveTab] = useState("service");
  const [selectedService, setSelectedService] = useState("Please choose a service");
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<ServiceListItem | null>(null);
  const [tabsWidth, setTabsWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabs = ["service", "reviews", "about"];

  const serviceCenterImages: Record<string, ImageSourcePropType> = {
    "TechCare Hub Jakarta": require("../../../assets/images/sv_ct/placeholder.jpg"),
    "FixIt Gadget Studio": require("../../../assets/images/sv_ct/placeholder.jpg"),
    "Doctor Gadget Surabaya": require("../../../assets/images/sv_ct/placeholder.jpg"),
  };

  const getServiceCenterImage = (imagePath?: string | null, fallbackName?: string): ImageSourcePropType => {
    if (typeof imagePath === "string" && imagePath.length > 0) {
      if (/^https?:\/\//i.test(imagePath)) {
        return { uri: imagePath };
      }

      return { uri: `${API_ORIGIN}/storage/${imagePath.replace(/^\/+/, "")}` };
    }

    if (fallbackName && serviceCenterImages[fallbackName]) {
      return serviceCenterImages[fallbackName];
    }

    return require("../../../assets/images/sv_ct/placeholder.jpg");
  };

  const transformDetailsData = (data: any) => {
    return {
      name: data.name_service_center,
      address: data.address_service_center,
      rating: data.ratings_ang_vilai_rating || 0,
      ratingCount: data.ratings_count || 0,
      closesAt: data.closes_at,
      distance: `${data.distance} km`,
      image: getServiceCenterImage(data.foto_service_center, data.name_service_center),
    };
  };

  const transformServiceData = (service: any): ServiceListItem => ({
    id_service: service.id_service ?? service.id ?? service.nama_service ?? crypto.randomUUID(),
    name: service.nama_service || service.name || service.title || "Service",
    price: typeof service.harga_service === "number" ? `Rp${service.harga_service.toLocaleString("id-ID")}` : service.price,
    description: service.deskripsi_service || service.description || "",
    raw: service,
  });

  useEffect(() => {
    const nextIndex = tabs.indexOf(activeTab);

    Animated.timing(slideAnim, {
      toValue: nextIndex < 0 ? 0 : nextIndex,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab, slideAnim]);

  const serviceNameDisplay = serviceData?.name || serviceName;
  const serviceAddressDisplay = serviceData?.lokasi || serviceData?.address || serviceAddress;
  const serviceDistanceDisplay = serviceData?.distance || serviceDistance;
  const serviceClosesAtDisplay = serviceData?.closesAt || serviceClosesAt;
  const ratingValueDisplay = typeof serviceData?.rating === "number" ? serviceData.rating : ratingValue;

  const handleContinue = () => {
    router.push({
      pathname: "./confirm",
      params: {
        service_center: String(serviceId),
        service_center_name: serviceNameDisplay,
        selected_service_id: selectedServiceDetails?.id_service ? String(selectedServiceDetails.id_service) : "",
        selected_service_name: selectedServiceDetails?.name || selectedService,
        selected_service_price: selectedServiceDetails?.price ? selectedServiceDetails.price.replace(/[^0-9]/g, "") : "",
        selected_service_description: selectedServiceDetails?.description || "",
        service_variant: selectedService === "Home Service" ? "Home Service" : selectedService === "Scheduled Service" ? "Scheduled Service" : "Scheduled Service",
      },
    });
  };

  const getServiceCenterData = async () => {
    setIsLoading(true);
    try {
      const url = `${API_BASE_URL}/service_centers/${serviceId}`;
      console.log("Fetching service center from:", url);
      const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
      const text = await response.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        json = null;
      }

      if (!serviceId) {
        throw new Error("Missing service center id in route params");
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}: ${json?.message || text}`);
      }

      const payload = json || {};
      const data = payload.data || payload || {};

      const mapped = {
        id_service_center: data.id_service_center,
        name: data.name_service_center || data.name || "",
        deskripsi: data.deskripsi || data.description || "",
        lokasi: data.lokasi || data.location || data.address || "",
        status: data.status || "",
        foto: data.foto_service_center || data.foto || data.photo || data.image || null,
        rating: data.ratings_ang_vilai_rating || data.rating || data.ratings || 0,
        ratingCount: data.ratings_count || (data.ratings ? data.ratings.length : 0),
        closesAt: data.closes_at || data.closing_time || null,
        distance: data.distance ? `${data.distance} km` : null,
      };

      setServiceData(mapped);
      const services = data.services || payload.services || [];
      setServicesList(Array.isArray(services) ? services.map(transformServiceData) : []);
      const ratings = data.ratings || payload.ratings || [];
      setRatingsList(Array.isArray(ratings) ? ratings : []);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Failed to load service center", message, [
        { text: "Cancel", style: "cancel" },
        { text: "Retry", onPress: () => getServiceCenterData() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServiceCenterData();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer} edges={["top", "left", "right"]}>
      <View style={styles.topBar}>
        <BackBtn />
        <Text style={styles.detailsText}>Details</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Image */}
        <Image source={getServiceCenterImage(serviceData?.foto, serviceNameDisplay)} style={styles.detailsImage} />

        {/* Title with Save/Share */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }}>
          <Text style={styles.detailsTitle}>{serviceNameDisplay}</Text>
          <View style={{ flexDirection: "row" }}>
            <SaveBtn />
            <ShareBtn />
          </View>
        </View>

        {/* Rating and Address */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} isFilled={star <= Math.floor(ratingValueDisplay)} />
          ))}
          <Text style={styles.ratingText}>({Number(ratingValueDisplay).toFixed(1)})</Text>
        </View>
        <Text style={styles.addressText}>{serviceAddressDisplay}</Text>

        {/* Business Hours Section */}
        <View style={styles.infoCard}>
          <View style={styles.hoursRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ClockIcon />
              <Text style={{ marginLeft: 8 }}>9.00am - 10.00pm</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.openNow}>Open Now</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckIcon />
            <Text style={[styles.serviceAvailable, { marginLeft: 8, fontWeight: "bold" }]}>Available For Home Service</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer} onLayout={(event) => setTabsWidth(event.nativeEvent.layout.width)}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab]}>
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabsWidth > 0 ? tabsWidth / tabs.length : `${100 / tabs.length}%`,
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, tabsWidth > 0 ? tabsWidth / tabs.length : 0, tabsWidth > 0 ? (tabsWidth / tabs.length) * 2 : 0],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Service Card */}
        {activeTab === "service" && (
          <View style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingStateCard}>
                <ActivityIndicator size="large" color={defaultColor.primary.backgroundColor} />
                <Text style={styles.loadingStateTitle}>Loading services...</Text>
                <Text style={styles.loadingStateText}>Fetching the services this center provides.</Text>
              </View>
            ) : servicesList && servicesList.length > 0 ? (
              servicesList.map((svc: any, idx: number) => (
                <Pressable
                  key={String(svc.id_service ?? idx)}
                  onPress={() => {
                    setSelectedService(svc.name || "Service");
                    setSelectedServiceDetails(svc);
                  }}
                  style={[styles.serviceCard, selectedService === svc.name && styles.serviceCardSelected]}
                >
                  <Text style={styles.serviceName}>{svc.name || `Service ${idx + 1}`}</Text>
                  {svc.price && <Text style={styles.servicePrice}>{svc.price}</Text>}
                  {svc.description && <Text style={styles.serviceDescription}>{svc.description}</Text>}
                </Pressable>
              ))
            ) : (
              // fallback static options
              <>
                <Pressable
                  onPress={() => {
                    setSelectedService("Home Service");
                    setSelectedServiceDetails({
                      id_service: "home-service",
                      name: "Home Service",
                      price: "Rp110.000",
                      description: "Our expert technician will come to your location.",
                      raw: { variant: "Home Service" },
                    });
                  }}
                  style={[styles.serviceCard, selectedService === "Home Service" && styles.serviceCardSelected]}
                ></Pressable>

                <Pressable
                  onPress={() => {
                    setSelectedService("Scheduled Service");
                    setSelectedServiceDetails({
                      id_service: "scheduled-service",
                      name: "Scheduled Service",
                      price: "Rp90.000",
                      description: "Schedule your service in advance.",
                      raw: { variant: "Scheduled Service" },
                    });
                  }}
                  style={[styles.serviceCard, selectedService === "Scheduled Service" && styles.serviceCardSelected]}
                ></Pressable>
              </>
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={{ flexDirection: "column", marginLeft: 12 }}>
          <Text>Selected Service</Text>
          <Text style={{ fontWeight: "bold" }}>{selectedService}</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={() => router.push("/user/chat")}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: defaultColor.background.backgroundColor,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
    zIndex: 100,
  },
  detailsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
  detailsImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#666",
  },
  addressText: {
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  openNow: {
    color: "#00AA00",
    fontWeight: "600",
  },
  serviceAvailable: {
    fontSize: 14,
    color: defaultColor.primary.backgroundColor,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "33.33%",
    backgroundColor: defaultColor.primary.backgroundColor,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: defaultColor.primary.backgroundColor,
  },
  tabText: {
    fontSize: 14,
    color: "#999",
  },
  activeTabText: {
    fontSize: 14,
    color: defaultColor.primary.backgroundColor,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  serviceCard: {
    backgroundColor: "#FFF",
    borderWidth: 1.25,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  serviceCardSelected: {
    backgroundColor: "#D0E0FF",
    borderColor: defaultColor.primary.backgroundColor,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: defaultColor.primary.backgroundColor,
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
  },
  loadingStateCard: {
    backgroundColor: "#FFF",
    borderWidth: 1.25,
    borderColor: "#D6E4FF",
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingStateTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  loadingStateText: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  scheduleSection: {
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  selectedService: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  selectedServiceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  schedulePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  bottomBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopColor: defaultColor.primary.backgroundColor,
    borderTopWidth: 1,
  },
  chatButton: {
    marginLeft: "auto",
    backgroundColor: defaultColor.primary.backgroundColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonContainer: {
    backgroundColor: defaultColor.background.backgroundColor,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: defaultColor.primary.backgroundColor,
    width: "100%",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default details;
