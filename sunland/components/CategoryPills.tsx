import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface CategoryPillsProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.pill,
              selectedCategory === category && styles.selectedPill,
            ]}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.pillText,
                selectedCategory === category && styles.selectedPillText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceHighlight,
    marginRight: 8,
  },
  selectedPill: {
    backgroundColor: colors.primary,
  },
  pillText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedPillText: {
    color: colors.background,
  },
});

export default CategoryPills;