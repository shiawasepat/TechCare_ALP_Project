import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, Image, TouchableOpacity, PanResponder } from 'react-native';
import { router } from 'expo-router';
import SoftRadialBackground from '../../components/SoftRadialBackground';

const TOTAL_SLIDES = 2;
const CURRENT_SLIDE = 0; // 0 for onboarding1, 1 for onboarding2

export default function OnboardingScreen() {
  const [currentSlide] = useState(CURRENT_SLIDE);
  const dotAnim = useRef(new Animated.Value(currentSlide)).current;
  const navigating = useRef(false);
  const DOT_SPACING = 18;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        if (dx > 50) { // swipe right threshold
          handleNext();
        }
      },
    })
  ).current;

  const handleNext = () => {
    if (navigating.current) return;
    navigating.current = true;
    Animated.timing(dotAnim, {
      toValue: currentSlide + 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => router.push('/onboarding2'));
  };

  return (
    <SoftRadialBackground animated={false}>
      <View style={styles.contentContainer} {...panResponder.panHandlers}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/Onboarding1.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.paginationContainer}>
            <View style={styles.dotWrapper}>
              {[0, 1].map((index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.dot,
                    index === currentSlide ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
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
    width: 60,
    height: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
