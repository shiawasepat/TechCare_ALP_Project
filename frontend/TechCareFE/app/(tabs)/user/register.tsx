import { colors as defaultColor } from "@/styles/colors";
import { EyeIcon } from "@/components/svg/EyeIcon";
import { Image, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export function register() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {};

  return (
    <SafeAreaView style={[styles.container, styles.content]} edges={["top", "left", "right"]}>
      {/* Logo and Title */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 24 }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTech}>Tech</Text>
          <Text style={styles.titleCare}>Care</Text>
        </View>
      </View>

      {/* Blue Container */}
      <View style={styles.blueContainer}>
        {/* Name Input */}
        <TextInput placeholder="Name" value={name} onChangeText={setName} placeholderTextColor="#999" style={styles.input} />

        {/* Phone Number Input */}
        <TextInput placeholder="Contact No." value={phoneNumber} onChangeText={(value) => setPhoneNumber(value.replace(/[^0-9]/g, ""))} placeholderTextColor="#999" style={styles.input} />

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

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput placeholder="Confirm Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#999" style={styles.passwordInput} />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <EyeIcon show={showPassword} />
          </TouchableOpacity>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
          <Text style={styles.signInButtonText}>Create account</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>Already made an account? </Text>
          <TouchableOpacity>
            <Text style={styles.createAccountLink} onPress={() => router.push("/user/login")}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColor.background.backgroundColor,
  },
  content: {
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 50,
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
  blueContainer: {
    flex: 1,
    backgroundColor: defaultColor.primary.backgroundColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
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
  createAccountLink: {
    color: "#fff",
    fontSize: 18,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default register;
