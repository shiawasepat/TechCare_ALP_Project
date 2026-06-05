import { Image, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { EyeIcon } from "@/components/svg/EyeIcon";
import { Ionicons } from "@expo/vector-icons";
import { colors as defaultColor } from "@/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';

export function MitraLogin() {
  const API_BASE_URL = "https://herbal-ungodly-reformed.ngrok-free.dev/api";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getMitraLoginData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/mitra/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      // Check if response was successful
      if (!response.ok) {
        alert(json.message || "Login failed. Please try again.");
        return;
      }

      // Store the token
      await AsyncStorage.setItem("authToken", json.token);
      // FCM thingy magic
      try {
        const fcmToken = await messaging().getToken();
        console.log('🔥 FCM Token Siap Dikirim:', fcmToken);

        const fcmResponse = await fetch(`${API_BASE_URL}/mitra/update-fcm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${json.token}`, // Numpang token login
          },
          body: JSON.stringify({
            fcm_token: fcmToken,
          }),
        });

        if (fcmResponse.ok) {
          const fcmData = await fcmResponse.json();
          console.log(' Status DB Backend:', fcmData.message);
        } else {
          console.log(' Gagal update FCM di backend, status:', fcmResponse.status);
        }
      } catch (fcmError) {
        console.error("Gagal get/kirim FCM token:", fcmError);
        // if no FCM let it be. supaya tidak halang real login
      }
      // FCM akhir
      // Navigate to home
      router.replace("/mitra/order-view");
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    // Validate inputs
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    } else {
      getMitraLoginData();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Logo and Title */}
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleTech}>Tech</Text>
            <Text style={styles.titleCare}>Care</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text>for Partner</Text>
          </View>
        </View>

        {/* Blue Container */}
        <View style={styles.blueContainer}>
          {/* Email Input */}
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#999" style={styles.input} />

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#999" style={styles.passwordInput} />
            <View style={styles.divider} />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <EyeIcon show={showPassword} />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={isLoading}>
            <Text style={styles.signInButtonText}>{isLoading ? "Signing in..." : "Sign in"}</Text>
          </TouchableOpacity>

          {/* Create Account Link */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Don't have an account? </Text>
            <TouchableOpacity style={styles.contactUsButton}>
              <Ionicons name="call" size={16} color="#fff" style={styles.phoneIcon} />
              <Text style={styles.createAccountLink}>Contact us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColor.background.backgroundColor,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 80,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  titleTech: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  titleCare: {
    fontSize: 28,
    fontWeight: "bold",
    color: defaultColor.primary.backgroundColor,
  },
  subtitleContainer: {
    marginTop: 8,
  },
  blueContainer: {
    backgroundColor: defaultColor.primary.backgroundColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 130,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 15,
    marginBottom: 25,
  },
  googleButtonText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#000",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  orText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 18,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  divider: {
    width: 8,
    height: "100%",
    backgroundColor: defaultColor.primary.backgroundColor,
  },
  eyeIcon: {
    padding: 10,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 15,
    marginTop: 40,
    marginBottom: 45,
    alignItems: "center",
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  createAccountText: {
    color: "#fff",
    fontSize: 18,
  },
  contactUsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneIcon: {
    marginRight: 4,
  },
  createAccountLink: {
    color: "#fff",
    fontSize: 18,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default MitraLogin;
