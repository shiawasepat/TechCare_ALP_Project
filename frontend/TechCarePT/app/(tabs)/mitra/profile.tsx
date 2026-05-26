import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, TextInput } from "react-native";
import { colors } from "@/styles/colors";
import { DropdownIcon } from "@/components/svg/Dropdown";
import { useFocusEffect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://herbal-ungodly-reformed.ngrok-free.dev/api";

const formatTimeValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return value.length >= 5 ? value.slice(0, 5) : value;
};

export default function MitraProfile() {
  const getAuthToken = async () => {
    const storedToken = await AsyncStorage.getItem("authToken");
    return storedToken?.trim() || null;
  };

  const [isLoadingMitra, setIsLoadingMitra] = React.useState(false);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [serviceCenterName, setServiceCenterName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [openTime, setOpenTime] = React.useState("");
  const [closeTime, setCloseTime] = React.useState("");
  const [editNameModalVisible, setEditNameModalVisible] = React.useState(false);
  const [editLocationModalVisible, setEditLocationModalVisible] = React.useState(false);
  const [editHoursModalVisible, setEditHoursModalVisible] = React.useState(false);
  const [editNameValue, setEditNameValue] = React.useState("");
  const [editLocationValue, setEditLocationValue] = React.useState("");
  const [editOpenTimeValue, setEditOpenTimeValue] = React.useState("");
  const [editCloseTimeValue, setEditCloseTimeValue] = React.useState("");

  const applyServiceCenterData = React.useCallback((data: any) => {
    setServiceCenterName(data?.name_service_center || "-");
    setLocation(data?.lokasi_service_center || "-");
    setOpenTime(formatTimeValue(data?.open_time));
    setCloseTime(formatTimeValue(data?.close_time));
  }, []);

  const getUserData = React.useCallback(async () => {
    const url = `${API_BASE_URL}/mitra/my-service-center`;
    try {
      setIsLoadingMitra(true);
      const token = await getAuthToken();
      if (!token) {
        router.replace("/mitra/login");
        return;
      }

      console.log("Fetching user data from:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const text = await response.text();
      console.log("Profile response status:", response.status, "body:", text);

      const trimmed = text ? String(text).trim() : "";
      if (trimmed && (/<!doctype html/i.test(trimmed) || /<html/i.test(trimmed))) {
        console.error("Received HTML when expecting JSON for profile:", trimmed.slice(0, 500));
        alert(`Server returned HTML instead of JSON. Check the API URL:\n${url}\nOpen it in a browser to inspect the response.`);
        return;
      }

      let json: any = null;
      try {
        json = trimmed ? JSON.parse(trimmed) : null;
      } catch (parseErr) {
        json = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem("authToken");
          router.replace("./login");
          return;
        }

        const message = (json && (json.message || json.error)) || text || `Request failed with status ${response.status}`;
        Alert.alert("Failed to load profile", String(message));
        return;
      }

      const payload = json || {};
      const data = payload.service_center || payload.data?.service_center || payload.data || payload || {};

      applyServiceCenterData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error fetching user data:", message);
      alert(`Failed to load profile: ${message}`);
    } finally {
      setIsLoadingMitra(false);
    }
  }, [applyServiceCenterData]);

  const updateServiceCenterProfile = React.useCallback(
    async (payload: Record<string, string>) => {
      const token = await getAuthToken();
      if (!token) {
        router.replace("/mitra/login");
        return false;
      }

      try {
        setIsSavingProfile(true);

        const response = await fetch(`${API_BASE_URL}/mitra/my-service-center`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const text = await response.text();
        const trimmed = text ? String(text).trim() : "";

        let json: any = null;
        try {
          json = trimmed ? JSON.parse(trimmed) : null;
        } catch {
          json = null;
        }

        if (!response.ok) {
          const message = (json && (json.message || json.error)) || text || `Request failed with status ${response.status}`;
          Alert.alert("Failed to save changes", String(message));
          return false;
        }

        const updatedData = json?.service_center || json?.data?.service_center || json?.data || {};
        applyServiceCenterData(updatedData);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        Alert.alert("Failed to save changes", message);
        return false;
      } finally {
        setIsSavingProfile(false);
      }
    },
    [applyServiceCenterData],
  );

  // Re-fetch when screen comes into focus (useful when returning to this screen)
  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, []),
  );

  const handleLogout = async () => {
    try {
      const token = await getAuthToken();

      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue local logout even if API logout fails
      console.error("Error during logout:", error);
    } finally {
      await AsyncStorage.removeItem("authToken");
      router.replace("/mitra/login");
    }
  };

  const logoutAlert = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogout,
        },
      ],
      { cancelable: true },
    );
  };

  const handleSaveName = async () => {
    const saved = await updateServiceCenterProfile({ name_service_center: editNameValue.trim() });
    if (saved) {
      setEditNameModalVisible(false);
    }
  };

  const handleSaveLocation = async () => {
    const saved = await updateServiceCenterProfile({ lokasi_service_center: editLocationValue.trim() });
    if (saved) {
      setEditLocationModalVisible(false);
    }
  };

  const handleSaveHours = async () => {
    const saved = await updateServiceCenterProfile({
      open_time: editOpenTimeValue.trim(),
      close_time: editCloseTimeValue.trim(),
    });

    if (saved) {
      setEditHoursModalVisible(false);
    }
  };

  const handleSaveAllChanges = async () => {
    await updateServiceCenterProfile({
      name_service_center: serviceCenterName.trim(),
      lokasi_service_center: location.trim(),
      open_time: openTime.trim(),
      close_time: closeTime.trim(),
    });
  };

  return (
    <View style={styles.profileContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* TopBar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>My Service Center Profile</Text>
          <TouchableOpacity style={styles.editBtn} onPress={logoutAlert}>
            <Text style={styles.editBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <TouchableOpacity style={styles.cameraBtn}>
            <Feather name="camera" style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
        {/* Shop State */}
        <View style={styles.stateContainer}>
          <View style={styles.stateHeader}>
            <View style={styles.stateItem}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2D6BFF", marginRight: 6 }} />
              <Text style={styles.stateText}>Open</Text>
            </View>
            <DropdownIcon />
          </View>
          <View style={styles.operationalHours}>
            <Text style={styles.operationalHoursText}>
              Operational hours for today {openTime || "--:--"} - {closeTime || "--:--"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>General Information</Text>
        <View style={styles.informationContainer}>
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="storefront" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Service Center Name</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn}>
                <Text
                  style={styles.changeBtnText}
                  onPress={() => {
                    setEditNameValue(serviceCenterName);
                    setEditNameModalVisible(true);
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoValue}>{serviceCenterName}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn}>
                <Text
                  style={styles.changeBtnText}
                  onPress={() => {
                    setEditLocationValue(location);
                    setEditLocationModalVisible(true);
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoValue}>{location}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              setEditOpenTimeValue(openTime);
              setEditCloseTimeValue(closeTime);
              setEditHoursModalVisible(true);
            }}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#2D6BFF" />
              </View>
              <Text style={styles.settingItemText}>Operation hour</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          <View style={styles.settingSeparator} />
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push("./withdrawal") as never}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2D6BFF" />
              </View>
              <Text style={styles.settingItemText}>Withdrawal account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
        {/* Save Changes */}
        <View style={styles.saveContainer}>
          <TouchableOpacity style={[styles.saveBtn, isSavingProfile && styles.saveBtnDisabled]} onPress={handleSaveAllChanges} disabled={isSavingProfile || isLoadingMitra}>
            <Text style={styles.saveBtnText}>{isSavingProfile ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <MitraBottomNavigation />
      {/* Edit Service Center Name Modal */}
      <Modal visible={editNameModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "#FFF", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15 }}>Edit Service Center Name</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 20,
                fontSize: 14,
              }}
              value={editNameValue}
              onChangeText={setEditNameValue}
              placeholder="Enter service center name"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#E5E5E5", paddingVertical: 10, borderRadius: 4 }} onPress={() => setEditNameModalVisible(false)}>
                <Text style={{ textAlign: "center", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#2D6BFF", paddingVertical: 10, borderRadius: 4 }}
                onPress={handleSaveName}
              >
                <Text style={{ textAlign: "center", fontWeight: "600", color: "#FFF" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Location Modal */}
      <Modal visible={editLocationModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "#FFF", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15 }}>Edit Location</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 20,
                fontSize: 14,
              }}
              value={editLocationValue}
              onChangeText={setEditLocationValue}
              placeholder="Enter location"
              multiline={true}
              numberOfLines={3}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#E5E5E5", paddingVertical: 10, borderRadius: 4 }} onPress={() => setEditLocationModalVisible(false)}>
                <Text style={{ textAlign: "center", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#2D6BFF", paddingVertical: 10, borderRadius: 4 }}
                onPress={handleSaveLocation}
              >
                <Text style={{ textAlign: "center", fontWeight: "600", color: "#FFF" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editHoursModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <View style={{ width: "100%", backgroundColor: "#FFF", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15 }}>Edit Operation Hours</Text>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#6B7280", marginBottom: 6 }}>Open time</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 14,
                fontSize: 14,
              }}
              value={editOpenTimeValue}
              onChangeText={setEditOpenTimeValue}
              placeholder="09:00"
              placeholderTextColor="#999"
            />
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#6B7280", marginBottom: 6 }}>Close time</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E5E5",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 20,
                fontSize: 14,
              }}
              value={editCloseTimeValue}
              onChangeText={setEditCloseTimeValue}
              placeholder="20:00"
              placeholderTextColor="#999"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#E5E5E5", paddingVertical: 10, borderRadius: 4 }} onPress={() => setEditHoursModalVisible(false)}>
                <Text style={{ textAlign: "center", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#2D6BFF", paddingVertical: 10, borderRadius: 4 }} onPress={handleSaveHours}>
                <Text style={{ textAlign: "center", fontWeight: "600", color: "#FFF" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  profileContainer: {
    backgroundColor: colors.background.backgroundColor,
    flex: 1,
    paddingBottom: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  editBtn: {},
  editBtnText: {
    color: "#2D6BFF",
    fontSize: 16,
    fontWeight: "600",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 20,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E5E5",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  stateContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  stateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  operationalHours: {
    borderRadius: 8,
  },
  stateText: {
    fontSize: 16,
    fontWeight: "700",
  },
  operationalHoursText: {
    fontWeight: "400",
    fontSize: 14,
    color: "#999",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  informationContainer: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 0,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  infoItem: {
    flexDirection: "column",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginLeft: 30,
  },
  changeBtn: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  changeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  settingsContainer: {
    flexDirection: "column",
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  settingSeparator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  saveContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  saveBtn: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelBtn: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  cancelBtnText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: colors.primary.backgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginLeft: 10,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
