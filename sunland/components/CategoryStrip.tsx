import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

interface CategoryStripProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const CategoryStrip: React.FC<CategoryStripProps> = ({ categories, onSelectCategory }) => {
  // We're keeping the props interface the same for compatibility,
  // but we won't be using the buttons anymore

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn.shopify.com/s/files/1/2682/9856/files/20180731171118882678_250x250_copy_2.png?v=1747745201" }}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40, // Maintained height
    marginVertical: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  }
});

export default CategoryStrip;