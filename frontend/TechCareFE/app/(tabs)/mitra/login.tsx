import { Image, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { EyeIcon } from "@/components/svg/EyeIcon";
import { Ionicons } from "@expo/vector-icons";
import { colors as defaultColor } from "@/styles/colors";

export function MitraLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Dummy credentials for testing
    const dummyUsername = "tech";
    const dummyPassword = "123";

    // Validate inputs
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // For testing: log the credentials
    console.log("Sign in attempt:", { username, password });

    // Mock successful login - replace with actual API call
    if (username === dummyUsername && password === dummyPassword) {
      console.log("Login successful!");
      // Navigate to home screen or dashboard
      router.push("./order-view");
    } else {
      alert("Invalid credentials. Try: tech / 123");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo and Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>TechCare</Text>
      </View>

      {/* Blue Container */}
      <View style={styles.blueContainer}>
        {/* Username Input */}
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} placeholderTextColor="#999" style={styles.input} />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholderTextColor="#999" style={styles.passwordInput} />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <EyeIcon show={showPassword} />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    margin: 80,
    fontWeight: "bold",
    color: "#000",
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
