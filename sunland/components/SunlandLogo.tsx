import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';

interface SunlandLogoProps {
  size?: number;
  style?: object;
}

const SunlandLogo: React.FC<SunlandLogoProps> = ({ 
  size = 235,
  style = {}
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source="https://cdn.shopify.com/s/files/1/2682/9856/files/100956624-decorative-frame-elegant-vector-element-for-design-in-eastern-style-place-for-text-floral-golden.jpg?v=1747718452"
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SUNLAND</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontSize: 36, // Increased by 50% from 24 to 36
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  }
});

export default SunlandLogo;