import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  // Removed the mini player and playback controls completely
  
  return (
    <View style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});