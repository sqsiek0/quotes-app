import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { QuoteResponse } from "../../types/Quotes";

export default function Quotes() {
  const { search } = useLocalSearchParams<{
    search?: string;
  }>();

  const quotesList: QuoteResponse[] = Array.from({ length: 100 }, (_, idx) => ({
    id: idx + 1,
    quote: `Sample quote ${idx + 1}`,
    author: `Author ${idx + 1}`,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={quotesList}
        keyExtractor={(item) => item.id.toString()}
        style={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.quoteText}>{item.quote}</Text>
            <Text style={styles.authorText}>- {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 16,
    marginBottom: 4,
  },
  authorText: {
    fontSize: 14,
    textAlign: "right",
    color: "#555",
  },
});
