import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, TextInput, RefreshControl } from "react-native";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import { API_BASE_URL } from "@/constants/api";
import { BackBtn } from "@/components/btn/back-btn";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [editNameModalVisible, setEditNameModalVisible] = React.useState(false);
  const [editContactModalVisible, setEditContactModalVisible] = React.useState(false);
  const [editNameValue, setEditNameValue] = React.useState("");
  const [editContactValue, setEditContactValue] = React.useState("");

  const getAuthToken = async () => {
    const storedToken = await AsyncStorage.getItem("authToken");
    return storedToken?.trim() || null;
  };

  const getUserData = async () => {
    const url = `${API_BASE_URL}/user`;
    try {
      setIsLoadingProfile(true);
      const token = await getAuthToken();
      if (!token) {
        router.replace("/user/login");
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
          router.replace("/user/login");
          return;
        }

        const message = (json && (json.message || json.error)) || text || `Request failed with status ${response.status}`;
        Alert.alert("Failed to load profile", String(message));
        return;
      }

      const payload = json || {};
      const data = payload.data || payload || {};

      setUserName((data && (data.name || data.nama)) || "-");
      setContact((data && (data.contact || data.phone || data.telepon)) || "-");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Error fetching user data:", message);
      alert(`Failed to load profile: ${message}`);
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
      router.replace("/user/login");
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
  return (
    <View style={styles.profileContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} refreshControl={<RefreshControl refreshing={isLoadingProfile} onRefresh={getUserData} />}>
        {/* TopBar */}
        <View style={styles.topBar}>
          <BackBtn />
          <Text style={styles.title}>My Profile</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <TouchableOpacity style={styles.cameraBtn}>
            <Feather name="camera" style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>

        {isLoadingProfile && <Text style={{ textAlign: "center", color: "#666", marginBottom: 8 }}>Loading profile...</Text>}

        <Text style={styles.sectionTitle}>General Information</Text>
        <View style={styles.informationContainer}>
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="storefront" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Name</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn}>
                <Text
                  style={styles.changeBtnText}
                  onPress={() => {
                    setEditNameValue(userName);
                    setEditNameModalVisible(true);
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoValue}>{userName}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Contact No.</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn}>
                <Text
                  style={styles.changeBtnText}
                  onPress={() => {
                    setEditContactValue(contact);
                    setEditContactModalVisible(true);
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoValue}>{contact}</Text>
          </View>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.infoItem} onPress={() => {}}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="translate" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Choose Language</Text>
              </View>
            </View>
            <Text style={styles.infoValue}>English</Text>
          </TouchableOpacity>
        </View>

        {/* Save Changes */}
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.editBtn} onPress={logoutAlert}>
            <Text style={styles.editBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
                onPress={() => {
                  setUserName(editNameValue);
                  setEditNameModalVisible(false);
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "600", color: "#FFF" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Contact Modal */}
      <Modal visible={editContactModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "80%", backgroundColor: "#FFF", borderRadius: 8, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 15 }}>Edit Contact</Text>
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
              value={editContactValue}
              onChangeText={setEditContactValue}
              placeholder="Enter contact information"
              multiline={true}
              numberOfLines={3}
              keyboardType="phone-pad"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: "#E5E5E5", paddingVertical: 10, borderRadius: 4 }} onPress={() => setEditContactModalVisible(false)}>
                <Text style={{ textAlign: "center", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#2D6BFF", paddingVertical: 10, borderRadius: 4 }}
                onPress={() => {
                  setContact(editContactValue);
                  setEditContactModalVisible(false);
                }}
              >
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
    padding: 20,
    gap: 4,
  },
  profileContainer: {
    backgroundColor: colors.background.backgroundColor,
    flex: 1,
    paddingBottom: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
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
    marginBottom: 4,
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
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  editBtn: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 12,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#2D6BFF",
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
