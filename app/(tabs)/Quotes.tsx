import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { QuoteResponse } from "../../types/Quotes";
import { useTheme } from "../../hooks/ThemeProvider";
import AppQuoteCard from "../../components/AppQuoteCard";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Quotes() {
  const { search } = useLocalSearchParams<{
    search?: string;
  }>();
  const [colors, typo, _, mode] = useTheme();
  const [refreshDragging, setRefreshDragging] = useState(false);

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
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          console.log("End reached");
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshDragging}
            onRefresh={() => {
              setRefreshDragging(true);
              setTimeout(() => {
                setRefreshDragging(false);
              }, 2000);
            }}
          />
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 12,
            }}
          />
        )}
        ListFooterComponent={() => <ActivityIndicator></ActivityIndicator>}
        ListFooterComponentStyle={{
          padding: 16,
          alignItems: "center",
        }}
        style={{ padding: 16 }}
        renderItem={({ item }) => (
          <AppQuoteCard quote={item.quote} author={item.author} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
