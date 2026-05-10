import { Image, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { router, useRouter } from "expo-router";
import { EyeIcon } from "@/components/svg/EyeIcon";
import { colors as defaultColor } from "@/styles/colors";

export function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Dummy credentials for testing
    const dummyEmail = "tech";
    const dummyPassword = "123";

    // Validate inputs
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // For testing: log the credentials
    console.log("Sign in attempt:", { email, password });

    // Mock successful login - replace with actual API call
    if (email === dummyEmail && password === dummyPassword) {
      console.log("Login successful!");
      // Navigate to home screen or dashboard
      router.push("/user/dashboard");
    } else {
      alert("Invalid credentials. Try: tech / 123");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo and Title */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTech}>Tech</Text>
          <Text style={styles.titleCare}>Care</Text>
        </View>
      </View>

      {/* Blue Container */}
      <View style={styles.blueContainer}>
        {/* Google Sign In Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require("../../../assets/Google.jpg")} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Or Divider */}
        <Text style={styles.orText}>or</Text>

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
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Create Account Link */}
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>New here? </Text>
          <TouchableOpacity>
            <Text style={styles.createAccountLink} onPress={() => router.push("/user/register")}>
              Create an account
            </Text>
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
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 80,
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

export default login;
