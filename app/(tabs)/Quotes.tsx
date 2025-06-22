import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { QuoteResponse } from "../../types/Quotes";
import { useTheme } from "../../hooks/ThemeProvider";

export default function Quotes() {
  const { search } = useLocalSearchParams<{
    search?: string;
  }>();
  const [colors, typo, _, mode] = useTheme();

  const quotesList: QuoteResponse[] = Array.from({ length: 100 }, (_, idx) => ({
    id: idx + 1,
    quote: `Sample quote ${idx + 1}`,
    author: `Author ${idx + 1}`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={quotesList}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        style={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={typo.headerBody}>{item.quote}</Text>
            <Text
              style={[
                typo.small,
                {
                  textAlign: "right",
                },
              ]}
            >
              - {item.author}
            </Text>
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
    borderRadius: 8,
    borderWidth: 1,
  },
});
