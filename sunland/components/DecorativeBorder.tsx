import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

interface DecorativeBorderProps {
  width?: number | string;
  height?: number;
  style?: object;
}

const DecorativeBorder: React.FC<DecorativeBorderProps> = ({ 
  width = '100%', 
  height = 40, // Reduced height by 50% (from 80 to 40)
  style = {}
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <ImageBackground
        source={{ uri: "https://cdn.shopify.com/s/files/1/2682/9856/files/istockphoto-993001256-612x612_copy.jpg?v=1747718451" }}
        style={styles.image}
        resizeMode="stretch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginVertical: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  }
});

export default DecorativeBorder;