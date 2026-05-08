import { Animated, Image, Text, View, StyleSheet, TouchableOpacity, ScrollView, Pressable, Easing } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { colors as defaultColor } from "@/styles/colors";
import { BackBtn } from "@/components/btn/back-btn";
import { SaveBtn } from "@/components/btn/save-btn";
import { ShareBtn } from "@/components/btn/share-btn";
import { StarIcon } from "@/components/svg/Star";
import { ServiceIcon } from "@/components/svg/Service";
import { ClockIcon } from "@/components/svg/Clock";
import { CheckIcon } from "@/components/svg/Check";

export function details() {
  const navigation = useNavigation();
  const [rating] = useState(4);
  const [activeTab, setActiveTab] = useState("service");
  const [selectedService, setSelectedService] = useState<"Home Service" | "Scheduled Service">("Home Service");
  const slideAnim = useRef(new Animated.Value(0)).current;

  const tabs = ["service", "reviews", "about"];

  const handleContinue = () => {
    // Commented to prevent navigation
    // if (selectedService == "Home Service") {
    //   navigation.navigate("home-service");
    // }
    // else if (selectedService == "Scheduled Service") {
    //   navigation.navigate("scheduled-service");
    // }
  };

  useEffect(() => {
    const tabIndex = tabs.indexOf(activeTab);
    Animated.timing(slideAnim, {
      toValue: tabIndex,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [activeTab, slideAnim]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <BackBtn />
        <Text style={styles.detailsText}>Details</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Image */}
        <Image source={require("@/assets/images/sv_ct/mcp.jpg")} style={styles.detailsImage} />

        {/* Title with Save/Share */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }}>
          <Text style={styles.detailsTitle}>Mugen Computer Pettarani</Text>
          <View style={{ flexDirection: "row" }}>
            <SaveBtn />
            <ShareBtn />
          </View>
        </View>

        {/* Rating and Address */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} isFilled={star <= rating} />
          ))}
          <Text style={styles.ratingText}>({rating})</Text>
        </View>
        <Text style={styles.addressText}>Jl. A. P. Pettarani No.89a, Makassar</Text>

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
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab]}>
              <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: ["0%", "100%", "200%"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Service Card */}
        {activeTab === "service" && (
          // Home Service Card
          <View style={styles.contentContainer}>
            <Pressable onPress={() => setSelectedService("Home Service")} style={[styles.serviceCard, selectedService === "Home Service" && styles.serviceCardSelected]}>
              <Text style={styles.serviceName}>Home Service</Text>
              <Text style={styles.servicePrice}>Rp110.000</Text>
              <Text style={styles.serviceDescription}>Our expert technician will come to your location.</Text>
            </Pressable>

            <Pressable onPress={() => setSelectedService("Scheduled Service")} style={[styles.serviceCard, selectedService === "Scheduled Service" && styles.serviceCardSelected]}>
              <Text style={styles.serviceName}>Scheduled Service</Text>
              <Text style={styles.servicePrice}>Rp90.000</Text>
              <Text style={styles.serviceDescription}>Schedule your service in advance.</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <ServiceIcon service={selectedService} />
        <View style={{ flexDirection: "column", marginLeft: 12 }}>
          <Text>Selected Service</Text>
          <Text style={{ fontWeight: "bold" }}>{selectedService}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingVertical: 20,
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
