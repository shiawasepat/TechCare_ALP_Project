import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SoftRadialBackground from '../../components/SoftRadialBackground';

export default function OnboardingScreenTwo() {
  return (
    <SoftRadialBackground animated={false}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/Onboarding2.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
            <View style={styles.paginationContainer}>
              <View style={[styles.dot, styles.inactiveDot]} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

          <Text style={styles.title}>
            Pesan Layanan{"\n"}
            dengan Mudah
          </Text>

          <Text style={styles.subtitle}>
            Solusi mudah untuk perawatan dan{"\n"}
            perbaikan laptop Anda
          </Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => router.push('/user/login')}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SoftRadialBackground>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 4,
    alignItems: 'center',
    paddingBottom: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#111827',
    width: '100%',
    maxWidth: 200,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});