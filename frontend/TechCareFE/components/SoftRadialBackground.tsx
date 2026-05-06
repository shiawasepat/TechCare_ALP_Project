import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, SafeAreaView } from 'react-native';

interface Props {
  children: ReactNode;
  animated?: boolean; // default false to avoid unexpected native/web animation
}

const SoftRadialBackground = ({ children, animated = false }: Props) => {
  const centerPosition = { x: 0.5, y: 0.4 }; 
  const gradientRadius = 500; 
  const blueBlobOne = useRef(new Animated.ValueXY({ x: -20, y: -20 })).current;
  const blueBlobTwo = useRef(new Animated.ValueXY({ x: 30, y: 40 })).current;
  const blueBlobThree = useRef(new Animated.ValueXY({ x: -10, y: 20 })).current;
  const whiteBloom = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    if (!animated) return;

    let isMounted = true;

    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

    const animateBlob = (
      value: Animated.ValueXY,
      bounds: { x: [number, number]; y: [number, number] },
      durationRange: [number, number]
    ) => {
      const nextPosition = {
        x: randomBetween(bounds.x[0], bounds.x[1]),
        y: randomBetween(bounds.y[0], bounds.y[1]),
      };

      Animated.timing(value, {
        toValue: nextPosition,
        duration: randomBetween(durationRange[0], durationRange[1]),
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          animateBlob(value, bounds, durationRange);
        }
      });
    };

    animateBlob(blueBlobOne, { x: [-36, -6], y: [-30, 20] }, [9000, 14000]);
    animateBlob(blueBlobTwo, { x: [14, 62], y: [8, 52] }, [10000, 15000]);
    animateBlob(blueBlobThree, { x: [-30, 10], y: [0, 54] }, [11000, 16000]);
    animateBlob(whiteBloom, { x: [-18, 18], y: [-14, 20] }, [12000, 17000]);

    return () => {
      isMounted = false;
      blueBlobOne.stopAnimation();
      blueBlobTwo.stopAnimation();
      blueBlobThree.stopAnimation();
      whiteBloom.stopAnimation();
    };
  }, [animated, blueBlobOne, blueBlobThree, blueBlobTwo, whiteBloom]);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer} pointerEvents="none">
        <View style={styles.baseFill} />
        <View style={styles.edgeWashTopLeft} />
        <View style={styles.edgeWashBottom} />
        <View style={styles.whiteCenterGlow} />

        <Animated.View
          style={[
            styles.blueBlob,
            styles.blueBlobOne,
            { transform: [...blueBlobOne.getTranslateTransform(), { scale: 1.06 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.blueBlob,
            styles.blueBlobTwo,
            { transform: [...blueBlobTwo.getTranslateTransform(), { scale: 0.92 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.blueBlob,
            styles.blueBlobThree,
            { transform: [...blueBlobThree.getTranslateTransform(), { scale: 0.88 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.whiteBloom,
            { transform: [...whiteBloom.getTranslateTransform(), { scale: 1.03 }] },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  baseFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  edgeWashTopLeft: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(222, 238, 255, 0.88)',
  },
  edgeWashBottom: {
    position: 'absolute',
    left: -60,
    right: -60,
    bottom: -150,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(209, 230, 255, 0.65)',
  },
  whiteCenterGlow: {
    position: 'absolute',
    top: 78,
    left: 78,
    width: 260,
    height: 500,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  blueBlob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(167, 210, 255, 0.72)',
  },
  blueBlobOne: {
    width: 260,
    height: 260,
    top: -70,
    left: -95,
    opacity: 0.9,
  },
  blueBlobTwo: {
    width: 230,
    height: 230,
    top: 18,
    right: -84,
    opacity: 0.72,
  },
  blueBlobThree: {
    width: 310,
    height: 310,
    bottom: -100,
    left: -90,
    opacity: 0.66,
  },
  whiteBloom: {
    position: 'absolute',
    width: 280,
    height: 420,
    top: 110,
    left: 70,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
  },
  safeArea: {
    flex: 1,
  },
});

export default SoftRadialBackground;