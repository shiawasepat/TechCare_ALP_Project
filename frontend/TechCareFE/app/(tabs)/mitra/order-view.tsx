import { Animated, Text, Dimensions, StyleSheet, TouchableOpacity, View, Modal, Pressable, FlatList, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect, useRef } from "react";
import { styles } from "@/styles/mitra/order-view";
import { colors } from "@/styles/colors";
import { LocationIcon } from "@/components/svg/Location";
import { DropdownIcon } from "@/components/svg/Dropdown";
import { ServiceIcon } from "@/components/svg/Service";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";

const { width } = Dimensions.get("window");

interface Order {
  id: string;
  name: string;
  time: string;
  location: string;
  distance: string;
  serviceType: string;
  price: string;
  status: "new" | "ongoing" | "done";
  isNew?: boolean;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    name: "Laur",
    time: "15 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Home Service",
    price: "Rp120.000",
    status: "new",
    isNew: true,
  },
  {
    id: "2",
    name: "Laury",
    time: "15 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Scheduled Service",
    price: "Rp120.000",
    status: "new",
  },
  {
    id: "3",
    name: "Laury",
    time: "30 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Scheduled Service",
    price: "Rp120.000",
    status: "new",
  },
  {
    id: "4",
    name: "Laury",
    time: "15 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Scheduled Service",
    price: "Rp120.000",
    status: "new",
  },
  {
    id: "5",
    name: "Laury",
    time: "15 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Scheduled Service",
    price: "Rp120.000",
    status: "new",
  },
  {
    id: "6",
    name: "Laury",
    time: "15 mins ago",
    location: "Jl. Pettarani No 89",
    distance: "2.4 km away",
    serviceType: "Home Service",
    price: "Rp120.000",
    status: "new",
  },
];

export default function OrderView() {
  const tabs = ["all", "new", "ongoing", "done"];
  const [rejectConfirmVisible, setRejectConfirmVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [handlingOrderId, setHandlingOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState<"all" | "new" | "ongoing" | "done">("all");
  const cardAnimations = useRef(MOCK_ORDERS.map(() => new Animated.Value(0))).current;
  const [shopStatus, setShopStatus] = useState<"open" | "closed">("open");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [selectedStatusOption, setSelectedStatusOption] = useState<"open" | "closed-while" | "closed-until">("open");
  const [closedDuration, setClosedDuration] = useState<30 | 60 | 90>(30);

  useEffect(() => {
    const tabIndex = tabs.indexOf(activeTab);
    Animated.timing(slideAnim, {
      toValue: tabIndex,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [activeTab]);

  const filteredOrders = (() => {
    if (activeTab === "all") {
      const ongoing = orders.filter((order) => order.status === "ongoing");
      const others = orders.filter((order) => order.status !== "ongoing");
      return [...ongoing, ...others];
    } else {
      return orders.filter((order) => order.status === activeTab);
    }
  })();

  const handleConfirmReject = () => {
    // Remove the rejected order from the list
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrderId));
    setRejectConfirmVisible(false);
    setSelectedOrderId(null);
  };

  const handleAcceptOrder = (orderId: string) => {
    // Mark order as being handled
    setHandlingOrderId(orderId);
    // After 2 seconds, move to ongoing status
    setTimeout(() => {
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status: "ongoing" as const } : order)));
      setHandlingOrderId(null);
    }, 2000);
  };

  const handleCancelReject = () => {
    setRejectConfirmVisible(false);
    setSelectedOrderId(null);
  };

  const handleRejectPress = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRejectConfirmVisible(true);
  };

  const renderOrderCard = ({ item, index }: { item: Order; index: number }) => {
    const isHandling = handlingOrderId === item.id;
    const isFirstOngoing = index === 0 && item.status === "ongoing" && activeTab === "all";

    return (
      <>
        {isFirstOngoing && <Text style={styles.sectionHeader}>Pinned - Current Orders</Text>}
        <View style={[styles.orderCard, isHandling && { opacity: 0.6 }]}>
          <View style={styles.orderInfo}>
            {/* Order Info */}
            <View style={styles.profileSection}>
              <View style={styles.avatar} /> {/* Avatar */}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            )}
          </View>

          <View style={styles.locationSection}>
            <LocationIcon />
            <View>
              <Text style={styles.address}>{item.location}</Text>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
          </View>

          <View style={styles.serviceSection}>
            <ServiceIcon service={item.serviceType as "Home Service" | "Scheduled Service"} />
            <Text style={styles.serviceType}>{item.serviceType}</Text>
          </View>

          <Text style={styles.price}>{item.price}</Text>

          {/* Reject & Accept */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectPress(item.id)} disabled={isHandling}>
              <Text style={styles.rejectButtonText}>{isHandling ? "Processing..." : "Reject"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.acceptButton, isHandling && { opacity: 0.6 }]} onPress={() => handleAcceptOrder(item.id)} disabled={isHandling}>
              <Text style={styles.acceptButtonText}>{isHandling ? "Accepting..." : item.status === "ongoing" ? "Handling" : "Accept Order"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Shop Status Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#333", marginLeft: 16 }}>Orders</Text>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: selectedStatusOption === "open" ? "#4CAF50" : "#999",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
          onPress={() => setStatusMenuVisible(!statusMenuVisible)}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>{selectedStatusOption === "open" ? "Open" : selectedStatusOption === "closed-while" ? `Close (${closedDuration}m)` : "Closed"}</Text>
          <DropdownIcon />
        </TouchableOpacity>
      </View>

      {/* Status Menu Modal */}
      <Modal visible={statusMenuVisible} transparent animationType="fade">
        <BlurView style={styles.blurContainer} intensity={90}>
          <Pressable style={styles.centeredView} onPress={() => setStatusMenuVisible(false)}>
            <View style={[styles.modalView, { paddingVertical: 24 }]}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 8 }}>Service center status</Text>
              <Text style={{ fontSize: 14, color: "#999", marginBottom: 24 }}>Check your store current status and you can change it anytime from here.</Text>

              {/* Option 1: Open for Orders */}
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: selectedStatusOption === "open" ? "#f0f7ff" : "#fff",
                }}
                onPress={() => setSelectedStatusOption("open")}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>Open for Orders</Text>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedStatusOption === "open" ? "#2196f3" : "#ccc",
                    backgroundColor: selectedStatusOption === "open" ? "#2196f3" : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedStatusOption === "open" && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />}
                </View>
              </TouchableOpacity>

              {/* Option 2: Close for a while */}
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  backgroundColor: selectedStatusOption === "closed-while" ? "#f0f7ff" : "#fff",
                }}
                onPress={() => setSelectedStatusOption("closed-while")}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>Close for a while</Text>
                    <Text style={{ fontSize: 13, color: "#999", marginTop: 4 }}>Closed at set times</Text>
                  </View>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: selectedStatusOption === "closed-while" ? "#2196f3" : "#ccc",
                      backgroundColor: selectedStatusOption === "closed-while" ? "#2196f3" : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedStatusOption === "closed-while" && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />}
                  </View>
                </View>

                {selectedStatusOption === "closed-while" && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[30, 60, 90].map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          backgroundColor: closedDuration === duration ? "#2196f3" : "#f0f0f0",
                          flex: 1,
                          alignItems: "center",
                        }}
                        onPress={() => setClosedDuration(duration as 30 | 60 | 90)}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: closedDuration === duration ? "#fff" : "#666",
                          }}
                        >
                          {duration} Mins
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </TouchableOpacity>

              {/* Option 3: Closed until Open */}
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: selectedStatusOption === "closed-until" ? "#f0f7ff" : "#fff",
                }}
                onPress={() => setSelectedStatusOption("closed-until")}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "600", color: "#333" }}>Closed until Open</Text>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedStatusOption === "closed-until" ? "#2196f3" : "#ccc",
                    backgroundColor: selectedStatusOption === "closed-until" ? "#2196f3" : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedStatusOption === "closed-until" && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />}
                </View>
              </TouchableOpacity>

              {/* Change Status Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#2196f3",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={() => {
                  const statusMap = { open: "open", "closed-while": "closed", "closed-until": "closed" };
                  setShopStatus(statusMap[selectedStatusOption]);
                  setStatusMenuVisible(false);
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>Change Status</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </BlurView>
      </Modal>

      {/* Tab Navigation */}

      <View style={[styles.tabContainer, { position: "relative" }]}>
        {(["all", "new", "ongoing", "done"] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab === "all" ? "All order" : tab === "new" ? "New" : tab === "ongoing" ? "On going" : "Done"}</Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            width: "25%",
            backgroundColor: colors.primary.backgroundColor,
            borderRadius: 2,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: [0, width / 4, width / 2, (width * 3) / 4],
                }),
              },
            ],
          }}
        />
      </View>

      {/* Order List */}
      <FlatList data={filteredOrders} renderItem={renderOrderCard} scrollEnabled={true} style={styles.listContent} />

      {/* Reject Confirmation Modal */}
      <Modal visible={rejectConfirmVisible} transparent animationType="fade">
        <BlurView style={styles.blurContainer} intensity={90}>
          <Pressable style={styles.centeredView} onPress={handleCancelReject}>
            <View style={styles.modalView}>
              <Text style={styles.confirmTitle}>Reject Order?</Text>
              <Text style={styles.confirmMessage}>Are you sure you want to reject this order?</Text>

              <View style={styles.confirmButtonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReject}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmRejectButton} onPress={handleConfirmReject}>
                  <Text style={styles.confirmRejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </BlurView>
      </Modal>
      <MitraBottomNavigation />
    </View>
  );
}
