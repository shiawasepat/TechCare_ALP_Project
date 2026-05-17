import React from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { MitraBottomNavigation } from "@/components/MitraBottomNavigation";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, TextInput } from "react-native";
import { colors } from "@/styles/colors";
import { DropdownIcon } from "@/components/svg/Dropdown";

export default function MitraProfile() {
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
          onPress: () => {
            // Handle actual logout logic here, such as clearing tokens or navigating to the login screen
            console.log("User logged out");
          },
        },
      ],
      { cancelable: true },
    );
  };
  const [serviceCenterName, setServiceCenterName] = React.useState("Elextra Komputer");
  const [location, setLocation] = React.useState("5.1 km • Jl. A.P. Pettarani Ruko Diamond No. 3");
  const [editNameModalVisible, setEditNameModalVisible] = React.useState(false);
  const [editLocationModalVisible, setEditLocationModalVisible] = React.useState(false);
  const [editNameValue, setEditNameValue] = React.useState("");
  const [editLocationValue, setEditLocationValue] = React.useState("");
  return (
    <View style={styles.profileContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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
            <Text style={styles.operationalHoursText}>Operational hours for today 09:00 - 20:00</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>General Information</Text>
        <View style={styles.informationContainer}>
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="storefront" size={20} color="#2D6BFF" />
                <Text style={styles.infoLabel}>Service center name</Text>
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
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#2D6BFF" />
              </View>
              <Text style={styles.settingItemText}>Operation hour</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          <View style={styles.settingSeparator} />
          <TouchableOpacity style={styles.settingItem}>
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
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
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
                onPress={() => {
                  setServiceCenterName(editNameValue);
                  setEditNameModalVisible(false);
                }}
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
                onPress={() => {
                  setLocation(editLocationValue);
                  setEditLocationModalVisible(false);
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
