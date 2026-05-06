import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SoftRadialBackground from '../../components/SoftRadialBackground';

export default function OnboardingScreen() {
  // dot animation 
  const dotAnim = useRef(new Animated.Value(0)).current;
  const navigating = useRef(false);
  const DOT_SPACING = 18; 

  const handleNext = () => {
    if (navigating.current) return;
    navigating.current = true;
    Animated.timing(dotAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => router.push('/onboarding2'));
  };

  return (
    <SoftRadialBackground animated={false}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/Onboarding1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.paginationContainer}>
            <View style={styles.dotWrapper}>
              <View style={[styles.dot, styles.inactiveDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
              <Animated.View
                style={[
                  styles.activeIndicator,
                  { transform: [{ translateX: dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0, DOT_SPACING] }) }] },
                ]}
              />
            </View>
          </View>

          <Text style={styles.title}>
            Welcome to{'\n'}
            <Text style={styles.techText}>Tech</Text>
            <Text style={styles.careText}>Care</Text>
          </Text>

          <Text style={styles.subtitle}>
            Solusi mudah untuk perawatan dan{'\n'}
            perbaikan laptop Anda
          </Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext}>
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
  dotWrapper: {
    width: 40,
    height: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
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
  techText: {
    color: '#000000',
  },
  careText: {
    color: '#3B82F6',
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
