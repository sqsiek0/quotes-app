import { useLocalSearchParams } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Pressable,
} from "react-native";
import { useTheme } from "../../hooks/ThemeProvider";
import AppQuoteCard from "../../components/AppQuoteCard";
import { useListQuotes } from "../../hooks/quotes/useListQuotes";

export default function Quotes() {
  const { search } = useLocalSearchParams<{
    search?: string;
  }>();
  const [colors, typo, _, mode] = useTheme();
  const {
    data,
    refetch,
    isLoading,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  } = useListQuotes();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 500);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text
          style={[typo.heading, { color: colors.danger, textAlign: "center" }]}
        >
          Error: {error?.message}
        </Text>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <Text>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data?.pages.flatMap((page) => page.quotes) || []}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle={mode === "dark" ? "white" : "black"}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator />
              <Text>Loading more...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No quotes found</Text>
          </View>
        )}
        ListFooterComponentStyle={{
          padding: 16,
          alignItems: "center",
        }}
        style={{ padding: 16 }}
        renderItem={({ item }) => {
          return <AppQuoteCard quote={item.quote} author={item.author} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  retryButton: {
    marginTop: 16,
    alignSelf: "center",
    padding: 8,
    // backgroundColor: colors.accent,
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
